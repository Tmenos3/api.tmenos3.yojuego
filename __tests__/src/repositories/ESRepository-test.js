import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  let getMockedClient = (err, ret) => {
    return {
      get: jest.fn((criteria, callback) => { callback(err, ret); }),
      search: jest.fn((criteria, callback) => { callback(err, ret); }),
      index: jest.fn((criteria, callback) => { callback(err, ret); })
    }
  };

  it('Cannot create with an undefined ESClient', () => {
    let undefinedESClient;

    expect(() => new ESRepository(undefinedESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Cannot create with a null ESClient', () => {
    let nullESClient = null;

    expect(() => new ESRepository(nullESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Can create a valid ESRepository', () => {
    let validClient = {};
    let repo = new ESRepository(validClient);

    expect(repo.esclient).toEqual(validClient);
  });

  pit('Cannot getById with undefined id', () => {
    let undefinedId;
    let repo = new ESRepository({});

    return repo.getById(undefinedId, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_ID));
  });

  pit('Cannot getById with null id', () => {
    let nullId = null;
    let repo = new ESRepository({});

    return repo.getById(nullId, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_ID));
  });

  pit('Cannot getById with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.getById('id', undefinedIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot getById with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.getById('id', nullIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot getById with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.getById('id', 'index', undefinedType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Cannot getById with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.getById('id', 'index', nullType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Can get a document by id ', () => {
    var toReturn = { _id: 'id', source: {} };
    let client = getMockedClient(false, toReturn);

    let repo = new ESRepository(client);
    return repo.getById('id', 'index', 'type')
      .then((objectReturned) => {
        expect(client.get.mock.calls[0][0].index).toEqual('index');
        expect(client.get.mock.calls[0][0].type).toEqual('type');
        expect(client.get.mock.calls[0][0].id).toEqual('id');
        expect(objectReturned).toEqual(toReturn);
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element does not exist getById returns null', () => {
    let client = getMockedClient({ status: 404 }, {});

    let repo = new ESRepository(client);
    return repo.getById('id', 'index', 'type')
      .then((objectReturned) => {
        expect(objectReturned).toBeNull();
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error getById must execute reject', () => {
    let client = getMockedClient(true, {});

    let repo = new ESRepository(client);
    return repo.getById('id', 'index', 'type')
      .then((objectReturned) => expect(true).toEqual(false), (err) => expect(err).toEqual(ESRepository.UNEXPECTED_ERROR));
  });

  pit('Cannot getBy with undefined criteria', () => {
    let undefinedCriteria;
    let repo = new ESRepository({});

    return repo.getBy(undefinedCriteria, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_CRITERIA));
  });

  pit('Cannot getBy with null criteria', () => {
    let nullCriteria = null;
    let repo = new ESRepository({});

    return repo.getBy(nullCriteria, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_CRITERIA));
  });

  pit('Cannot getBy with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.getBy({ criteria: 'criteria' }, undefinedIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot getBy with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.getBy({ criteria: 'criteria' }, nullIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot getBy with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.getBy({ criteria: 'criteria' }, 'index', undefinedType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Cannot getBy with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.getBy({ criteria: 'criteria' }, 'index', nullType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Can get documents by criteria', () => {
    var arrayToReturn = [{ obj: 'object_one' }, { obj: 'object_two' }];
    var criteria = { field1: '1', field2: 2 };
    var client = {
      search: jest.fn((criteria, callback) => { callback(false, { hits: { hits: arrayToReturn } }); })
    };

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
    let client = getMockedClient(false, { hits: { hits: [] } });

    //Hay que ver que devuelve ES cuando no encuentra registros, dependiendo de ese resultado
    //quizas haya que refactorizar el test

    let repo = new ESRepository(client);
    return repo.getBy({ criteria: 'id' }, 'index', 'type')
      .then((list) => expect(list).toEqual([]), (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error getBy must execute reject', () => {
    let client = getMockedClient(true, {});

    let repo = new ESRepository(client);
    return repo.getBy({ criteria: 'id' }, 'index', 'type')
      .then((list) => expect(true).toEqual(false), (err) => expect(err).toEqual(ESRepository.UNEXPECTED_ERROR));
  });

  pit('Cannot add document with undefined document', () => {
    let undefinedDocument;
    let repo = new ESRepository({});

    return repo.add(undefinedDocument, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_DOCUMENT));
  });

  pit('Cannot add document with null document', () => {
    let nullDocument = null;
    let repo = new ESRepository({});

    return repo.add(nullDocument, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_DOCUMENT));
  });

  pit('Cannot add document with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.add({ document: 'document' }, undefinedIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot add document with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.getBy({ document: 'document' }, nullIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot add document with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.add({ document: 'document' }, 'index', undefinedType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Cannot add document with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.add({ document: 'document' }, 'index', nullType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Can add documents', () => {
    var document = { field1: '1', field2: 2 };
    let client = getMockedClient(false, {});

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
    let client = getMockedClient(true, {});

    let repo = new ESRepository(client);
    return repo.add({ document: 'id' }, 'index', 'type')
      .then((list) => expect(true).toEqual(false), (err) => expect(err).toEqual(ESRepository.UNEXPECTED_ERROR));
  });
});
