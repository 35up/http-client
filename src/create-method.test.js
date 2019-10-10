import sinon from 'sinon';
import { expect } from 'chai';
import {
  mockOneJsonResponse,
  resetRequestMocks,
} from './test/mock-response';
import { createMethod } from './create-method';
import { encodeRequestBody } from './encode-request-body';
import { decodeResponseBody } from './decode-response-body';

jest.mock('./decode-response-body');
jest.mock('./encode-request-body');

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

async function testSuccess(method, baseUrl, endpointUrl, body, options) {
  mockOneJsonResponse(mockData);
  const responseBody = await method(endpointUrl, body, options);
  expect(responseBody).to.be.deep.equal(mockData);
  expect(fetch.mock.calls[0][0]).to.be.equal(`${baseUrl}${endpointUrl}`);
  return responseBody;
}

async function testSuccessWithBody(method, baseUrl, endpointUrl, body, options) {
  await testSuccess(method, baseUrl, endpointUrl, body, options);
  expect(fetch.mock.calls[0][1].body).to.be.deep.equal(JSON.stringify(body));
}

async function testFail(method, baseUrl, endpointUrl, body, options) {
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

      describe('when createMethod was called with default options', () => {
        let method;

        beforeEach(() => {
          method = createMethod('PUT', baseUrl, {mode: 'cors', withCredentials: true});
        });

        it('uses default configuration', async () => {
          await testSuccess(method, baseUrl, endpointUrl);
          expect(fetch.mock.calls[0][1].credentials).to.be.equal('include');
          expect(fetch.mock.calls[0][1].mode).to.be.equal('cors');
        });

        it('options provided to the function take precedence over the default configurations', async () => {
          await testSuccess(
            method,
            baseUrl,
            endpointUrl,
            null,
            {mode: 'navigation', withCredentials: false},
          );
          expect(fetch.mock.calls[0][1].credentials).to.be.undefined;
          expect(fetch.mock.calls[0][1].mode).to.be.equal('navigation');
        });
      });

      describe('when the function was created for the "HEAD" method', () => {
        let method;

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
