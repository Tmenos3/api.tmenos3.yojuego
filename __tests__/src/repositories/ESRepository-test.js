jest.mock('elasticsearch');

import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  it('Cannot create with an undefined ESClient', () => {
    let undefinedESClient;

    expect(() => new ESRepository(undefinedESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Cannot create with a null ESClient', () => {
    let nullESClient = null;

    expect(() => new ESRepository(nullESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Can create a valid ESRepository', () => {
    let es = require('elasticsearch');
    es.Client = jest.fn();
    let client = new es.Client();
    
    let repo = new ESRepository(client);

    expect(repo.esclient).toEqual(client);
  });

  pit('Can get a document by id ', () => {
    let es = require('elasticsearch');
    es.Client = jest.fn();
    let client = new es.Client();
    
    let repo = new ESRepository(client);

    expect(repo.esclient.mock.calls.length).toEqual(2);
    expect(repo.esclient.mock.calls[1][0].host).toEqual('http://localhost:9200/');
  });
});