import { expect } from 'chai';
import { encodeRequestBody } from './encode-request-body';

describe('encodeRequestBody', () => {
  it('encode the body as JSON', () => {
    const body = {name: 'joe doe'};
    const result = encodeRequestBody(body);

    expect(result).to.have.property('body').equals(JSON.stringify(body));
    expect(result).to.have.property('headers')
      .that.include({'Content-Type': 'application/json'});
  });

  describe('when body is a string', () => {
    const body = 'this is content that for some reason is a plain string';

    it('encodes the body as text', () => {
      const result = encodeRequestBody(body);

      expect(result).to.have.property('body').equals(body);
      expect(result).to.have.property('headers')
        .that.include({'Content-Type': 'text/plain'});
    });
  });

  describe('when body is UrlSearchParams', () => {
    const body = new URLSearchParams({name: 'joe doe'});

    it('encodes the body as "application/x-www-form-urlencoded"', () => {
      const result = encodeRequestBody(body);

      expect(result).to.have.property('body').equals(body.toString());
      expect(result).to.have.property('headers')
        .that.include({'Content-Type': 'application/x-www-form-urlencoded'});
    });
  });

  describe('when body is FormData', () => {
    it('encodes the body as "multipart/form-data"', () => {
      const body = new FormData();
      body.append('name', 'joe doe');
      body.append('file', new Blob([]));
      const result = encodeRequestBody(body);

      expect(result).to.have.property('body').equals(body);
      expect(result).to.have.property('headers')
        .that.include({'Content-Type': 'multipart/form-data'});
    });
  });
});
