import { expect } from 'chai';
import { decodeResponseBody } from './decode-response-body';

describe('decodeResponseBody', () => {
  const body = '<html lang="en">...</html>';
  let response;

  beforeEach(() => {
    response = new Response(body, {headers: {'Content-Type': 'text/html'}});
  });

  it('decodes the body as a string', async () => {
    expect(await decodeResponseBody(response)).to.be.equal(body);
  });

  describe('when contentType is "application/json"', () => {
    const body = {products: [{sku: 1}]};
    let response;

    beforeEach(() => {
      response = new Response(
        JSON.stringify(body),
        {headers: {'Content-Type': 'application/json'}},
      );
    });

    it('decodes the body as a JSON', async () => {
      expect(await decodeResponseBody(response)).to.be.deep.equal(body);
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
