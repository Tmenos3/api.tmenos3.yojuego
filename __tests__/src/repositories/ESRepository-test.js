jest.mock('elasticsearch');

import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  var es = require('elasticsearch');

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

  //hay que testear que ni el id, ni el index, ni el type sean null o undefined
  pit('Can get a document by id ', () => {
    var toReturn = { obj: 'any object to return' };
    var client = new es.Client();
    client.search = jest.fn((criteria, callback) => { callback(false, { hits: { hits: [toReturn] } }); });

    let repo = new ESRepository(client);
    return repo.getById('id', 'index', 'type')
      .then((objectReturned) => {
        expect(client.search.mock.calls[0][0].index).toEqual('index');
        expect(client.search.mock.calls[0][0].type).toEqual('type');
        expect(client.search.mock.calls[0][0].body.query.match._id).toEqual('id');
        expect(objectReturned).toEqual(toReturn);
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element does not exist getById returns null', () => {
    var client = new es.Client();
    client.search = jest.fn((criteria, callback) => { callback(false, { hits: { hits: [] } }); });

    let repo = new ESRepository(client);
    return repo.getById('id', 'index', 'type')
      .then((objectReturned) => {
        expect(objectReturned).toBeNull();
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error getById must execute reject', () => {
    var client = new es.Client();
    client.search = jest.fn((criteria, callback) => { callback(true, {}); });

    let repo = new ESRepository(client);
    return repo.getById('id', 'index', 'type')
      .then((objectReturned) => expect(true).toEqual(false), (err) => expect(err).toEqual(ESRepository.UNEXPECTED_ERROR));
  });

  //hay que testear que ni el id, ni el index, ni el type sean null o undefined
  pit('Can get documents by criteria', () => {
    var arrayToReturn = [{ obj: 'object_one' }, { obj: 'object_two' }];
    var criteria = { field1: '1', field2: 2 };
    var client = new es.Client();
    client.search = jest.fn((criteria, callback) => { callback(false, { hits: { hits: arrayToReturn } }); });

    let repo = new ESRepository(client);
    return repo.getBy(criteria, 'index', 'type')
      .then((list) => {
        expect(client.search.mock.calls[0][0].index).toEqual('index');
        expect(client.search.mock.calls[0][0].type).toEqual('type');
        expect(client.search.mock.calls[0][0].body.query.match).toEqual(criteria);
        expect(list.length).toEqual(arrayToReturn.length);
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element does not exist getBy returns []', () => {
    var client = new es.Client();
    client.search = jest.fn((criteria, callback) => { callback(false, { hits: { hits: [] } }); });
    //Hay que ver que devuelve ES cuando no encuentra registros, dependiendo de ese resultado
    //quizas haya que refactorizar el test

    let repo = new ESRepository(client);
    return repo.getBy({ criteria: 'id' }, 'index', 'type')
      .then((list) => expect(list).toEqual([]), (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error getBy must execute reject', () => {
    var client = new es.Client();
    client.search = jest.fn((criteria, callback) => { callback(true, {}); });

    let repo = new ESRepository(client);
    return repo.getBy({ criteria: 'id' }, 'index', 'type')
      .then((list) => expect(true).toEqual(false), (err) => expect(err).toEqual(ESRepository.UNEXPECTED_ERROR));
  });

  //hay que testear que ni el id, ni el index, ni el type sean null o undefined
  pit('Can add documents', () => {
    var document = { field1: '1', field2: 2 };
    var client = new es.Client();
    client.index = jest.fn((criteria, callback) => { callback(false, { }); });

    let repo = new ESRepository(client);
    return repo.add(document, 'index', 'type')
      .then((resp) => {
        expect(client.index.mock.calls[0][0].index).toEqual('index');
        expect(client.index.mock.calls[0][0].type).toEqual('type');
        expect(client.index.mock.calls[0][0].body).toEqual(document);
        expect(resp).toEqual(ESRepository.DOCUMENT_INSERTED);
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error add must execute reject', () => {
    var client = new es.Client();
    client.index = jest.fn((criteria, callback) => { callback(true, {}); });

    let repo = new ESRepository(client);
    return repo.add({ document: 'id' }, 'index', 'type')
      .then((list) => expect(true).toEqual(false), (err) => expect(err).toEqual(ESRepository.UNEXPECTED_ERROR));
  });
});
