import fetchMock from 'jest-fetch-mock';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
window.fetch = fetchMock;
