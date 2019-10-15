import sinon from 'sinon';

const realModule = require.requireActual('../decode-response-body');


module.exports = {
  ...realModule,
  decodeResponseBody: sinon.stub(realModule, 'decodeResponseBody')
    .callThrough(),
};
