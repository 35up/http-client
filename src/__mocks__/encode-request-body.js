import sinon from 'sinon';

const realModule = require.requireActual('../encode-request-body');


module.exports = {
  ...realModule,
  encodeRequestBody:
    sinon.stub(realModule, 'encodeRequestBody').callThrough(),
};
