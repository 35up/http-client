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
    expect(addUrlParams(url, [])).to.be.equal(url);
    expect(addUrlParams(url, new Date())).to.be.equal(url);
    expect(addUrlParams(url, null)).to.be.equal(url);
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

  it('supports params as URLSearchParams', () => {
    const url = '/path';
    const params = new URLSearchParams([
      ['single', 'single'],
      ['multiple', 'multi1'],
      ['multiple', '2'],
    ]);

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

  it('filters out invalid params', () => {
    const url = '/path';
    const params = {
      foo: 'bar',
      goo: true,
      boo: false,
      gee: 0,
      bee: 7,
      chicky: null,
      poocky: undefined,
      tosi: {},
      bosi: {m: 7},
      din: NaN,
      don: [],
      emptyString: '',
      value: 'v',
    };

    const expected = '/path?foo=bar&goo=true&boo=false&gee=0&bee=7&value=v';
    expect(addUrlParams(url, params)).to.be.equal(expected);
  });

  it('filters out invalid values within array param', () => {
    const url = '/path';
    const params = {
      foo: 'bar',
      goo: [1, true, '', false, null, {}, 0, 'buzz', NaN, undefined],
    };

    const expected = '/path?foo=bar&goo=1%2Ctrue%2Cfalse%2C0%2Cbuzz';
    expect(addUrlParams(url, params)).to.be.equal(expected);
  });
});
