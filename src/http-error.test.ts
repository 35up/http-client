import { expect } from 'chai';
import { HttpError } from './http-error';


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
  });
});
