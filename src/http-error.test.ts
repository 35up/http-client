import { expect } from 'chai';
import { HttpError, isHttpError } from './http-error';


describe('http-error', () => {
  describe('toString', () => {
    it('to string returns error message', () => {
      const err = new HttpError({error: 'sorry'}, new Response());

      expect(err.toString()).to.equal('Error: sorry');
    });

    describe('when error is not passed', () => {
      it('returns status and statusText', () => {
        const err = new HttpError(
          null,
          new Response(null, {status: 500, statusText: 'server is tired'}),
        );

        expect(err.toString()).to.equal('Error: 500 server is tired');
      });
    });

    describe('when error is an object', () => {
      it('returns a message from that object', () => {
        const err = new HttpError({error: {message: 'sorry'}}, new Response());

        expect(err.toString()).to.equal('Error: sorry');
      });
    });

    describe('when data is string', () => {
      it('includes it in the message directly', () => {
        const err = new HttpError('Unauthorized', new Response());

        expect(err.toString()).to.equal('Error: Unauthorized');
      });
    });
  });

  it('has responseStatus and responseStatusText', () => {
    const err = new HttpError(
      null,
      new Response(null, {status: 500, statusText: 'server is tired'}),
    );

    expect(err.responseStatus).to.equal(500);
    expect(err.responseStatusText).to.equal('server is tired');
  });

  it('has data', () => {
    const dataObj = {error: 'could not process the request'};
    const err = new HttpError(
      dataObj,
      new Response(null, {status: 400, statusText: 'bad request'}),
    );

    expect(err.data).to.equal(dataObj);
  });

  describe('isHttpError', () => {
    it('returns true when input is HttpError', () => {
      expect(isHttpError(new HttpError(null, new Response()))).to.be.true;
    });

    it('returns false when input is not HttpError', () => {
      expect(isHttpError(new Error('not an http error'))).to.be.false;
    });
  });
});
