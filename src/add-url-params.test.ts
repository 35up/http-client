import { expect } from 'chai';
import { addUrlParams } from './add-url-params';


describe('addUrlParams', () => {
  it('returns url when no param is provided', () => {
    const url = '/path';

    expect(addUrlParams(url, {})).to.be.equal(url);
  });

  it('returns url when param is not SearchParams', () => {
    const url = '/path';

    expect(addUrlParams(url, 'string')).to.be.equal(url);
    expect(addUrlParams(url, true)).to.be.equal(url);
    expect(addUrlParams(url, 123)).to.be.equal(url);
    expect(addUrlParams(url, {prop: {}})).to.be.equal(url);
  });

  it('returns url with query params', () => {
    const url = '/path';
    const params = {
      single: 'single',
      multiple: ['multi1', 2],
    };

    const expected = '/path?single=single&multiple=multi1%2C2';
    expect(addUrlParams(url, params)).to.be.equal(expected);
  });

  it('adds the params correctly when the url has existing url params', () => {
    const url = '/path?partner=35up';
    const params = {
      single: 'single',
      multiple: ['multi1', 'multi2'],
    };

    expect(addUrlParams(url, params)).to.be.equal(
      '/path?partner=35up&single=single&multiple=multi1%2Cmulti2',
    );
  });
});
