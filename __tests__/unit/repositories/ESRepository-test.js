import ESRepository from '../../../src/common/ESRepository';
import getMockedClient from '../../__tools__/mockedESClient';

describe('ESRepository', () => {
  it('Cannot create with an undefined ESClient', () => {
    let undefinedESClient;

    expect(() => new ESRepository(undefinedESClient)).toThrowError(ESRepository.ERRORS.INVALID_CLIENT);
  });

  it('Cannot create with a null ESClient', () => {
    let nullESClient = null;

    expect(() => new ESRepository(nullESClient)).toThrowError(ESRepository.ERRORS.INVALID_CLIENT);
  });

  it('Can create a valid ESRepository', () => {
    let validClient = {};
    let repo = new ESRepository(validClient);

    expect(repo.esclient).toEqual(validClient);
  });

  it('Cannot get with undefined id', () => {
    let undefinedId;
    let repo = new ESRepository({});

    return repo.get(undefinedId, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_ID)
      });
  });

  it('Cannot get with null id', () => {
    let nullId = null;
    let repo = new ESRepository({});

    return repo.get(nullId, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_ID)
      });
  });

  it('Cannot get with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.get('id', undefinedIndex, 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_INDEX)
      });
  });

  it('Cannot get with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.get('id', nullIndex, 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_INDEX)
      });
  });

  it('Cannot get with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.get('id', 'index', undefinedType)
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_TYPE)
      });
  });

  it('Cannot get with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.get('id', 'index', nullType)
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_TYPE)
      });
  });

  it('Can get a document by id ', () => {
    let toReturn = { _id: 'id', source: {} };
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
      }, (err) => { expect(true).toEqual(false) });
  });

  it('If element does not exist get returns null', () => {
    let client = getMockedClient({ status: 404 }, { code: 0, message: null, resp: null });

    let repo = new ESRepository(client);
    return repo.get('id', 'index', 'type')
      .then((objectReturned) => {
        expect(objectReturned.code).toBe(200);
        expect(objectReturned.resp).toBeNull();
      }, (err) => { expect(true).toEqual(false) });
  });

  it('If element esClient returns error get must execute reject', () => {
    let error = { status: 401, message: 'error' };
    let client = getMockedClient(error, {});

    let repo = new ESRepository(client);
    return repo.get('id', 'index', 'type')
      .then((objectReturned) => { expect(true).toEqual(false) },
      (err) => {
        expect(err.code).toEqual(error.status);
        expect(err.message).toEqual(error.message);
        expect(err.resp).toEqual(error);
      });
  });

  it('Cannot add document with undefined document', () => {
    let undefinedDocument;
    let repo = new ESRepository({});

    return repo.add(undefinedDocument, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_DOCUMENT)
      });
  });

  it('Cannot add document with null document', () => {
    let nullDocument = null;
    let repo = new ESRepository({});

    return repo.add(nullDocument, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_DOCUMENT)
      });
  });

  it('Cannot add document with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.add({ document: 'document' }, undefinedIndex, 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_INDEX)
      });
  });

  it('Cannot add document with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.add({ document: 'document' }, nullIndex, 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_INDEX)
      });
  });

  it('Cannot add document with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.add({ document: 'document' }, 'index', undefinedType)
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_TYPE)
      });
  });

  it('Cannot add document with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    repo.add({ document: 'document' }, 'index', nullType)
      .then(() => expect(true).toBe(false),
      (err) => expect(err.message).toEqual(ESRepository.ERRORS.INVALID_TYPE));
  });

  it('Can add documents', () => {
    var document = { field1: '1', field2: 2 };
    let client = getMockedClient(false, {});

    let repo = new ESRepository(client);
    repo.add(document, 'index', 'type')
      .then((resp) => {
        expect(client.index.mock.calls[0][0].index).toEqual('index');
        expect(client.index.mock.calls[0][0].type).toEqual('type');
        expect(client.index.mock.calls[0][0].body).toEqual(document);
        expect(resp.code).toEqual(200);
        expect(resp.message).toEqual(ESRepository.MESSAGES.DOCUMENT_INSERTED);
        expect(resp.resp).toEqual({});
      }, (err) => expect(true).toEqual(false));
  });

  it('If element esClient returns error add must execute reject', () => {
    let error = { statusCode: 404, message: 'error' };
    let client = getMockedClient(error, {});

    let repo = new ESRepository(client);
    return repo.add({ document: 'id' }, 'index', 'type')
      .then((list) => { expect(true).toEqual(false) },
      (err) => {
        expect(err.code).toEqual(error.statusCode);
        expect(err.message).toEqual(error.message);
        expect(err.resp).toEqual(error);
      });
  });

  it('Cannot update document with undefined id', () => {
    let undefinedId;
    let repo = new ESRepository({});

    return repo.update(undefinedId, {}, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_ID)
      });
  });

  it('Cannot update document with null id', () => {
    let nullId = null;
    let repo = new ESRepository({});

    return repo.update(nullId, {}, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_ID)
      });
  });

  it('Cannot update document with undefined document', () => {
    let undefinedDocument;
    let repo = new ESRepository({});

    return repo.update('id', undefinedDocument, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_DOCUMENT)
      });
  });

  it('Cannot update document with null document', () => {
    let nullDocument = null;
    let repo = new ESRepository({});

    return repo.update('id', nullDocument, 'index', 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_DOCUMENT)
      });
  });

  it('Cannot update document with undefined index', () => {
    let undefinedIndex;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, undefinedIndex, 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_INDEX)
      });
  });

  it('Cannot update document with null index', () => {
    let nullIndex = null;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, nullIndex, 'type')
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_INDEX)
      });
  });

  it('Cannot update document with undefined type', () => {
    let undefinedType;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, 'index', undefinedType)
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_TYPE)
      });
  });

  it('Cannot update document with null type', () => {
    let nullType = null;
    let repo = new ESRepository({});

    return repo.update('id', { document: 'document' }, 'index', nullType)
      .then(() => { expect(true).toBe(false) },
      (err) => {
        expect(err.message).toEqual(ESRepository.ERRORS.INVALID_TYPE)
      });
  });

  it('Can update documents', () => {
    let document = { id: 'id', document: { field1: '1', field2: 2 } };
    let client = getMockedClient(false, document);

    let repo = new ESRepository(client);
    return repo.update(document.id, document.document, 'index', 'type')
      .then((resp) => {
        expect(client.update.mock.calls[0][0].index).toEqual('index');
        expect(client.update.mock.calls[0][0].type).toEqual('type');
        expect(client.update.mock.calls[0][0].id).toEqual(document.id);
        expect(client.update.mock.calls[0][0].body.doc).toEqual(document.document);

        expect(resp.code).toEqual(200);
        expect(resp.message).toEqual(ESRepository.MESSAGES.DOCUMENT_UPDATED);
        expect(resp.resp).toEqual(document);
      }, (err) => { expect(true).toEqual(false) });
  });

  it('If element esClient returns error update must execute reject', () => {
    let error = { statusCode: 404, message: 'error' };
    let client = getMockedClient(error, {});

    let repo = new ESRepository(client);
    return repo.update('id', { document: 'id' }, 'index', 'type')
      .then(() => { expect(true).toEqual(false) },
      (err) => {
        expect(err.code).toEqual(error.statusCode);
        expect(err.message).toEqual(error.message);
        expect(err.resp).toEqual(error);
      });
  });
});
