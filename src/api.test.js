import { expect } from 'chai';
import { mockOneJsonResponse, resetRequestMocks } from './test/mock-response';
import api from './api';

const BASE_URL = 'https://caseable.com';

describe('api', () => {
  const url = '/test';
  const response = {};

  beforeEach(() => {
    mockOneJsonResponse(response);
  });

  describe('get', () => {
    it('uses get', async () => {
      await api.get(url);

      expect(fetch.mock.calls, 'no request was made').to.have.lengthOf(1);
      expect(fetch.mock.calls[0][1]).to.have.property('method', 'GET');
    });

    it('makes the request to the correct endpoint', async () => {
      await api.get(url);

      expect(fetch.mock.calls[0][0]).to.be.equal(`${url}`);
    });

    it('makes the request to the correct endpoint adding base url', async () => {
      await api.get(`${BASE_URL}${url}`);

      expect(fetch.mock.calls[0][0]).to.be.equal(`${BASE_URL}${url}`);
    });

    it('returns the same body that get returns', async () => {
      expect(await api.get(url)).to.be.deep.equal(response);
    });
  });

  describe('post', () => {
    const body = {niceBody: true};

    it('uses post', async () => {
      await api.post(url, body);

      expect(fetch.mock.calls, 'no request was made').to.have.lengthOf(1);
      expect(fetch.mock.calls[0][1]).to.have.property('method', 'POST');
    });

    it('makes the request to the correct endpoint', async () => {
      await api.post(url, body);

      expect(fetch.mock.calls[0][0]).to.be.equal(`${url}`);
    });

    it('post the body of the request in the correct encoding', async () => {
      await api.post(url, body);

      expect(fetch.mock.calls[0][1])
        .to.have.property('body', JSON.stringify(body));
      expect(fetch.mock.calls[0][1].headers)
        .to.include({'Content-Type': 'application/json'});
    });

    it('returns the same body that post returns', async () => {
      expect(await api.post(url, body)).to.be.deep.equal(response);
    });
  });

  afterEach(() => resetRequestMocks());
});
