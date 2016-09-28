import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  let getMockedClient = (err, ret) => {
    return {
      get: jest.fn((criteria, callback) => { callback(err, ret); }),
      search: jest.fn((criteria, callback) => { callback(err, ret); }),
      index: jest.fn((criteria, callback) => { callback(err, ret); }),
      delete: jest.fn((criteria, callback) => { callback(err, ret); }),
      update: jest.fn((criteria, callback) => { callback(err, ret); })
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

  pit('Cannot get with undefined id', () => {
    let undefinedId;
    let repo = new ESRepository({});

    return repo.get(undefinedId, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_ID));
  });

  pit('Cannot get with null id', () => {
    let nullId = null;
    let repo = new ESRepository({});

    return repo.get(nullId, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_ID));
  });

  pit('Cannot get with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.get('id', undefinedIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot get with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.get('id', nullIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot get with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.get('id', 'index', undefinedType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Cannot get with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.get('id', 'index', nullType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Can get a document by id ', () => {
    var toReturn = { _id: 'id', source: {} };
    let client = getMockedClient(false, toReturn);

    let repo = new ESRepository(client);
    return repo.get('id', 'index', 'type')
      .then((objectReturned) => {
        expect(client.get.mock.calls[0][0].index).toEqual('index');
        expect(client.get.mock.calls[0][0].type).toEqual('type');
        expect(client.get.mock.calls[0][0].id).toEqual('id');

        expect(objectReturned.code).toEqual(200);
        expect(objectReturned.message).toBeNull();
        expect(objectReturned.resp).toEqual(toReturn);
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element does not exist get returns null', () => {
    let client = getMockedClient({ status: 404 }, { code: 0, message: null, resp: null });

    let repo = new ESRepository(client);
    return repo.get('id', 'index', 'type')
      .then((objectReturned) => {
        expect(objectReturned.code).toBe(200);
        expect(objectReturned.resp).toBeNull();
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error get must execute reject', () => {
    let error = { statusCode: 404, message: 'error' };
    let client = getMockedClient(error, {});

    let repo = new ESRepository(client);
    return repo.get('id', 'index', 'type')
      .then((objectReturned) => expect(true).toEqual(false),
      (err) => {
        expect(err.code).toEqual(error.statusCode);
        expect(err.message).toEqual(error.message);
        expect(err.resp).toEqual(error);
      });
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

    return repo.add({ document: 'document' }, nullIndex, 'type')
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
        expect(resp.code).toEqual(200);
        expect(resp.message).toEqual(ESRepository.DOCUMENT_INSERTED);
        expect(resp.resp).toEqual({});
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error add must execute reject', () => {
    let error = { statusCode: 404, message: 'error' };
    let client = getMockedClient(error, {});

    let repo = new ESRepository(client);
    return repo.add({ document: 'id' }, 'index', 'type')
      .then((list) => expect(true).toEqual(false),
      (err) => {
        expect(err.code).toEqual(error.statusCode);
        expect(err.message).toEqual(error.message);
        expect(err.resp).toEqual(error);
      });
  });

  pit('Cannot update document with undefined id', () => {
    let undefinedId;
    let repo = new ESRepository({});

    return repo.update(undefinedId, {}, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_ID));
  });

  pit('Cannot update document with null id', () => {
    let nullId = null;
    let repo = new ESRepository({});

    return repo.update(nullId, {}, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_ID));
  });

  pit('Cannot update document with undefined document', () => {
    let undefinedDocument;
    let repo = new ESRepository({});

    return repo.update('id', undefinedDocument, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_DOCUMENT));
  });

  pit('Cannot update document with null document', () => {
    let nullDocument = null;
    let repo = new ESRepository({});

    return repo.update('id', nullDocument, 'index', 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_DOCUMENT));
  });

  pit('Cannot update document with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, undefinedIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot update document with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, nullIndex, 'type')
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_INDEX));
  });

  pit('Cannot update document with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, 'index', undefinedType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Cannot update document with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, 'index', nullType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.INVALID_TYPE));
  });

  pit('Can update documents', () => {
    var document = {id: 'id', document: { field1: '1', field2: 2 }};
    let client = getMockedClient(false, document);

    let repo = new ESRepository(client);
    return repo.update(document.id, document.document, 'index', 'type')
      .then((resp) => {
        expect(client.update.mock.calls[0][0].index).toEqual('index');
        expect(client.update.mock.calls[0][0].type).toEqual('type');
        expect(client.update.mock.calls[0][0].id).toEqual(document.id);
        expect(client.update.mock.calls[0][0].body.doc).toEqual(document.document);

        expect(resp.code).toEqual(200);
        expect(resp.message).toEqual(ESRepository.DOCUMENT_UPDATED);
        expect(resp.resp).toEqual(document);
      }, (err) => expect(true).toEqual(false));
  });

  pit('If element esClient returns error update must execute reject', () => {
    let error = { statusCode: 404, message: 'error' };
    let client = getMockedClient(error, {});

    let repo = new ESRepository(client);
    return repo.update('id', { document: 'id' }, 'index', 'type')
      .then((list) => expect(true).toEqual(false),
      (err) => {
        expect(err.code).toEqual(error.statusCode);
        expect(err.message).toEqual(error.message);
        expect(err.resp).toEqual(error);
      });
  });
});
