import sinon from 'sinon';
import { expect } from 'chai';
import fetch from 'jest-fetch-mock';
import { ImportMock } from 'ts-mock-imports';
import { mockOneJsonResponse, resetRequestMocks } from './test/mock-response';
import * as decodeModule from './decode-response-body';
import * as encodeModule from './encode-request-body';
import { createMethod, TOptions, TMethod } from './create-method';
import { addUrlParams } from './add-url-params';


const decodeResponseBody = ImportMock.mockFunction(
  decodeModule,
  'decodeResponseBody',
).callThrough();
const encodeRequestBody = ImportMock.mockFunction(
  encodeModule,
  'encodeRequestBody',
).callThrough();


const mockData = {
  productTypes: [
    {
      id: 'laptop-premium-sleeve',
      name: 'Laptop Premium Sleeve',
      productionTime: {
        max: 6,
        min: 3,
      },
      sku: 'SL',
    },
  ],
};

async function testSuccess(
  method: TMethod,
  baseUrl: string,
  endpointUrl: string,
  body?: any,
  options?: TOptions,
): Promise<any> {
  mockOneJsonResponse(mockData);
  const responseBody = await method(endpointUrl, body, options);
  expect(responseBody).to.be.deep.equal(mockData);
  expect(fetch.mock.calls[0][0]).to.contain(`${baseUrl}${endpointUrl}`);
  return responseBody;
}

async function testSuccessWithBody(
  method: TMethod,
  baseUrl: string,
  endpointUrl: string,
  body?: any,
  options?: TOptions,
): Promise<void> {
  await testSuccess(method, baseUrl, endpointUrl, body, options);
  expect(fetch.mock.calls[0][1].body).to.be.deep.equal(JSON.stringify(body));
}

async function testFail(
  method: TMethod,
  baseUrl: string,
  endpointUrl: string,
  body?: any,
  options?: TOptions,
): Promise<void> {
  mockOneJsonResponse({error: 'Oops'}, {status: 400});

  let error;
  try {
    await method(endpointUrl, body, options);
  } catch (e) {
    error = e;
  }

  expect(error).to.be.instanceOf(Error).with.property('message', 'Oops');
}

describe('services - http', () => {
  const baseUrl = 'https://example.com';
  const endpointUrl = '/products/';
  beforeEach(() => {
    encodeRequestBody.reset();
    encodeRequestBody.callThrough();
    decodeResponseBody.reset();
    decodeResponseBody.callThrough();
    resetRequestMocks();
  });

  describe('createMethod', () => {
    it('returns a function', () => {
      expect(createMethod('PUT', baseUrl)).to.be.a('function');
    });

    describe('returned function', () => {
      let method;

      beforeEach(() => {
        method = createMethod('PUT', baseUrl);
      });

      it('returns data when request is successful', async () => {
        const testBody = {test: 'foo'};
        await testSuccessWithBody(method, baseUrl, endpointUrl, testBody);
      });

      it('Uses the method specified in the function creation', async () => {
        const testBody = {test: 'foo'};
        await testSuccessWithBody(method, baseUrl, endpointUrl, testBody);
        expect(fetch.mock.calls[0][1].method).to.be.equal('PUT');
      });

      it('return throw when request fails', async () => {
        await testFail(method, baseUrl, endpointUrl);
      });

      it('uses `decodeResponseBody` to decode the response', async () => {
        const responseBody = await testSuccess(method, baseUrl, endpointUrl);

        expect(decodeResponseBody).to.have.been.calledOnce;
        expect(decodeResponseBody)
          .to.have.been.calledWith(sinon.match.instanceOf(Response));
        expect(responseBody)
          .to.be.equals(await decodeResponseBody.firstCall.returnValue);
      });

      it('uses `encodeResponseBody` to encode request body', async () => {
        const body = {foo: 'bar'};
        await testSuccessWithBody(method, baseUrl, endpointUrl, body);

        expect(encodeRequestBody).to.have.been.calledOnce;
        expect(encodeRequestBody).to.have.been.calledWith(body);
        expect(fetch.mock.calls[0][1].body)
          .to.be.equal(encodeRequestBody.firstCall.returnValue.body);
      });

      it('adds the headers provided by `encodeResponseBody` in the request', async () => {
        const body = {foo: 'bar'};
        await testSuccessWithBody(method, baseUrl, endpointUrl, body);

        expect(fetch.mock.calls[0][1].headers)
          .to.include(encodeRequestBody.firstCall.returnValue.headers);
      });

      it('does not override the other headers of the request with the ones provided by `encodeResponseBody`', async () => {
        const body = {foo: 'bar'};
        const options = {headers: {'Content-Type': 'application/octet-stream'}};
        await testSuccessWithBody(method, baseUrl, endpointUrl, body, options);

        expect(fetch.mock.calls[0][1].headers).to.include(options.headers);
      });

      it('adds the headers provided as a function', async () => {
        const body = {foo: 'bar'};
        const options = {
          headers: {'content-type': () => 'application/testing'},
        };

        await testSuccessWithBody(method, baseUrl, endpointUrl, body, options);
        expect(fetch.mock.calls[0][1].headers)
          .to.include({'content-type': 'application/testing'});
      });

      it('do not include credentials by default', async () => {
        await testSuccess(method, baseUrl, endpointUrl);
        expect(fetch.mock.calls[0][1].credentials).to.be.undefined;
      });

      it('include credentials when `withCredentials=true`', async () => {
        await testSuccess(
          method,
          baseUrl,
          endpointUrl,
          null,
          {withCredentials: true},
        );
        expect(fetch.mock.calls[0][1].credentials).to.be.equal('include');
      });

      it('uses the request mode indicated in the options', async () => {
        await testSuccess(
          method,
          baseUrl,
          endpointUrl,
          null,
          {mode: 'cors'},
        );
        expect(fetch.mock.calls[0][1].mode).to.be.equal('cors');
      });

      it('uses the headers specified in the options', async () => {
        const headers = {'Content-Type': 'application/octet-stream'};
        await testSuccess(
          method,
          baseUrl,
          endpointUrl,
          null,
          {headers},
        );
        expect(fetch.mock.calls[0][1].headers).to.include(headers);
      });

      it('adds parameters to url when provided', async () => {
        const params = {partnerId: '35up'};
        await testSuccess(
          method,
          baseUrl,
          endpointUrl,
          null,
          {params},
        );
        const url = `${baseUrl}${endpointUrl}`;
        expect(fetch.mock.calls[0][0]).to.be.equal(addUrlParams(url, params));
      });

      describe('when createMethod was called with default options', () => {
        const headers = {'Content-Type': 'application/octet-stream'};

        beforeEach(() => {
          method = createMethod(
            'PUT',
            baseUrl,
            {mode: 'cors', withCredentials: true, headers},
          );
        });

        it('uses default configuration', async () => {
          await testSuccess(method, baseUrl, endpointUrl);
          expect(fetch.mock.calls[0][1].credentials).to.be.equal('include');
          expect(fetch.mock.calls[0][1].mode).to.be.equal('cors');
          expect(fetch.mock.calls[0][1].headers).to.include(headers);
        });

        it('options provided to the function take precedence over the default configurations', async () => {
          const newHeaders = {Authorization: 'Basic 234567zHB==='};
          const mode = 'navigate';
          await testSuccess(
            method,
            baseUrl,
            endpointUrl,
            null,
            {mode, withCredentials: false, headers: newHeaders},
          );
          expect(fetch.mock.calls[0][1].credentials).to.be.undefined;
          expect(fetch.mock.calls[0][1].mode).to.be.equal(mode);
          expect(fetch.mock.calls[0][1].headers).to.include(newHeaders);
        });
      });

      describe('when the function was created for the "HEAD" method', () => {
        beforeEach(() => {
          method = createMethod('HEAD', baseUrl);
        });

        it('do not parse the response body', async () => {
          mockOneJsonResponse(mockData);
          await method(endpointUrl);

          expect(decodeResponseBody).to.not.have.been.called;
        });

        it('returns response object', async () => {
          mockOneJsonResponse(mockData);
          const data = await method(endpointUrl);

          expect(data).to.not.be.null;
          expect(data).to.be.instanceOf(Response);
        });
      });
    });
  });
});
