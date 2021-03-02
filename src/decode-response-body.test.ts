import { expect } from 'chai';
import { decodeResponseBody } from './decode-response-body';

describe('decodeResponseBody', () => {
  it('decodes the body as a string', async () => {
    const body = '<html lang="en">...</html>';
    const response = new Response(
      body,
      {headers: {'Content-Type': 'text/html'}},
    );
    expect(await decodeResponseBody(response)).to.be.equal(body);
  });

  describe('when contentType is "application/json"', () => {
    it('decodes the body as a JSON', async () => {
      const body = {products: [{sku: 1}]};
      const response = new Response(
        JSON.stringify(body),
        {headers: {'Content-Type': 'application/json'}},
      );
      expect(await decodeResponseBody(response)).to.be.deep.equal(body);
    });

    describe('when body does not exist', () => {
      it('returns an empty object', async () => {
        const response = new Response(
          undefined,
          {headers: {'Content-Type': 'application/json'}},
        );
        expect(await decodeResponseBody(response)).to.be.deep.equal({});
      });
    });
  });

  describe('when contentType is "text/x-json"', () => {
    const body = {products: [{sku: 1}]};
    let response;

    beforeEach(() => {
      response = new Response(
        JSON.stringify(body),
        {headers: {'Content-Type': 'text/x-json'}},
      );
    });

    it('decodes the body as a JSON', async () => {
      expect(await decodeResponseBody(response)).to.be.deep.equal(body);
    });
  });
});
