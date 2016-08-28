import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  it('Cannot create with an undefined source', () => {
    var undefinedSource;
  
    expect(() => new ESRepository(undefinedSource)).toThrowError(ESRepository.INVALID_SOURCE);
  });

  it('Cannot create with a source null', () => {
    var nullSource = null;
  
    expect(() => new ESRepository(nullSource)).toThrowError(ESRepository.INVALID_SOURCE);
  });

  it('Cannot create with an invalid uri format source', () => {
    var invalidSource = "invalidUriFormat";
  
    expect(() => new ESRepository(invalidSource)).toThrowError(ESRepository.INVALID_SOURCE);
  });
/*
  it('Can create a valid ESRepository', () => {
    var url = 'http://localhost/';
    var repo = new ESRepository(url);

    expect(repo.Source).toEqual(url);
  });


  pit('Connect must execute the resolve callback if connection succesful', () => {
    var mongoRep = new PlayerESRepository("aValidUrl");
    
    return mongoRep._connect()
    .then((db) => expect(db).not.toBeNull(), (err) => expect(true).toBe(false))
    .catch((err) => expect(true).toBe(false));
  });

  pit('Connect must execute the reject callback if connection fail', () => {
    mongodb.MongoClient.connect = mockedConnect(true, {});

    var mongoRep = new PlayerESRepository("anInvalidUrl");

    return mongoRep._connect()
          .then((db) => expect(true).toBe(false), (err) => expect(err).toEqual(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('The connection must be done with the source it has been created', () => {
    var aValidSource = 'aValidSource';
    var mongoRep = new PlayerESRepository(aValidSource);

    return mongoRep._connect()
          .then((db) => expect(mongodb.MongoClient.connect.mock.calls[0][0]).toEqual(aValidSource), (err) => expect(true).toBe(false))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Insert executes reject callback if connection is not established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.insert('rootDocument', {})
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Update executes reject callback if connection is not established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.update('rootDocument', {_id: 'anId'}, {})
          .then((msj) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Delete executes reject callback if connection is not established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.delete('aDocument', {})
          .then((msj) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot get any document if connection has not beed established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');
    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.getOne('aDocument', {})
          .then((msj) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getOne document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getOne(undefinedDocument, {})
          .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getOne document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getOne(nullDocument, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getOne document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getOne('aDocument', undefinedCriteria)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CRITERIA()))
           .catch((err) => expect(true).toBe(false));  
  });

  pit('Cannot getOne document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getOne('aDocument', nullCriteria)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CRITERIA()))
           .catch((err) => expect(true).toBe(false)); 
  });

  pit('Collection method from db must be called in getOne', () => {
    var documentToFind = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return {findOne: (criteria) => { return {}; }}});
    var db = {collection: mockedCollectionMethod, close: () => {}};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getOne(documentToFind, {})
           .then((objectReturned) => expect(mockedCollectionMethod).toBeCalledWith(documentToFind), (err) =>  expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('GetOne must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedGetThrowsException = jest.fn((document) => {return { findOne: (criteria) => { throw new Error(PlayerESRepository.UNEXPECTED_ERROR()); }, close: () => {} }});
    var db = {collection: mockedGetThrowsException};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getOne(documentToFind, {})
          .then((objectReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.UNEXPECTED_ERROR()))
          .catch((err) => { expect(true).toBe(false) });
  });

  pit('FindOne method from db must be called in getOne', () => {
    var documentToFind = 'aDocument';
    var db = { collection: (document) => { return { findOne: mockedFindMethod }},
               close: () => {} 
        };
    var mockedFindMethod = jest.fn((criteria) => {});

    var criteriaToApply = {};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getOne(documentToFind, criteriaToApply)
          .then((objectReturned) => expect(mockedFindMethod).toBeCalledWith(criteriaToApply), (err) => expect(true).toBe(false))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Can getOne a document collection', () => {
    var expectedResult = [{name: 'element1'}, {name: 'element2'}];
    var db = {
        collection: (document) => { return {findOne: jest.fn((criteria) => expectedResult) }; },
        close: () => {}
    };
    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getOne('aDocument', {})
           .then((objectReturned) => expect(objectReturned).toBe(expectedResult), (err) => expect(true).toBe(false))
           .catch(() => expect(true).toBe(false));
  });

  pit('After getOne connection must be closed', () => {
    var db = {
        collection: (document) => { return { findOne: (document) => {  } };},
        close: jest.fn(() => {})
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getOne('aDocumentToFind', {})
           .then((result) => {
                expect(db.close).toBeCalled();
           }, (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('GetAll executes reject callback if connection is not established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.getAll('rootDocument')
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getAll document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getAll(undefinedDocument)
          .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getAll document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getAll(nullDocument)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Collection method from db must be called in getAll', () => {
    var documentToFind = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return {find: (criteria) => { return {toArray: (callback) => { callback(false, [{}]); }}; }}});
    var db = {collection: mockedCollectionMethod, close: () => {}};


    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getAll(documentToFind)
           .then((objectReturned) => expect(true).toBe(false), (err) =>  expect(true).toBe(false))
           .catch((err) => expect(mockedCollectionMethod).toBeCalledWith(documentToFind));
  });

  pit('GetAll must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedGetThrowsException = jest.fn((document) => {return { find: (criteria) => { throw new Error(PlayerESRepository.UNEXPECTED_ERROR()); }, close: () => {} }});
    var db = {collection: mockedGetThrowsException};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getAll(documentToFind)
          .then((objectReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.UNEXPECTED_ERROR()))
          .catch((err) => { expect(true).toBe(false) });
  });

  pit('Find method from db must be called in getAll', () => {
    var documentToFind = 'aDocument';
    var db = { collection: (document) => { return { find: mockedFindMethod }},
               close: () => {} 
        };
    var mockedFindMethod = jest.fn((criteria) => {return { toArray: (callback) => { callback(false, [{}]); }}});

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getAll(documentToFind)
          .then((objectReturned) => expect(mockedFindMethod).toBeCalledWith({}), (err) => expect(true).toBe(false))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Can getAll a document collection', () => {
    var expectedResult = [{name: 'element1'}, {name: 'element2'}];
    var db = {
        collection: (document) => { return {find: jest.fn((criteria) => { return { toArray: (callback) => { callback(false, expectedResult) }}})}; },
        close: () => {}
    };
    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getAll('aDocument')
           .then((objectReturned) => expect(objectReturned).toBe(expectedResult), (err) => expect(true).toBe(false))
           .catch(() => expect(true).toBe(false));
  });

  pit('After getAll connection must be closed', () => {
    var db = {
        collection: (document) => { return { find: (document) => { return {toArray: (callback) => { callback(false, [{}]); }}}};},
        close: jest.fn(() => {})
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getAll('aDocumentToFind')
           .then((result) => expect(db.close).toBeCalled(), (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getBy document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getBy(undefinedDocument, {})
          .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getBy document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getBy(nullDocument, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot getBy document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getBy('aDocument', undefinedCriteria)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CRITERIA()))
           .catch((err) => expect(true).toBe(false));  
  });

  pit('Cannot getBy document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getBy('aDocument', nullCriteria)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CRITERIA()))
           .catch((err) => expect(true).toBe(false)); 
  });

  pit('getBy executes reject callback if connection is not established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.getBy('rootDocument', {})
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Collection method from db must be called in getBy', () => {
    var documentToFind = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return {find: (criteria) => { return {toArray: (callback) => { callback(false, [{}]); }}; }}});
    var db = {collection: mockedCollectionMethod, close: () => {}};


    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getBy(documentToFind, {})
           .then((listReturned) => expect(true).toBe(false), (err) =>  expect(true).toBe(false))
           .catch((err) => expect(mockedCollectionMethod).toBeCalledWith(documentToFind));
  });
  
  pit('GetBy must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedGetThrowsException = jest.fn((document) => {return { find: (criteria) => { throw new Error(PlayerESRepository.UNEXPECTED_ERROR()); }, close: () => {} }});
    var db = {collection: mockedGetThrowsException};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getBy(documentToFind, {})
          .then((objectReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.UNEXPECTED_ERROR()))
          .catch((err) => { expect(true).toBe(false) });
  });

  pit('Find method from db must be called in getBy', () => {
    var documentToFind = 'aDocument';
    var db = { collection: (document) => { return { find: mockedFindMethod }},
               close: () => {} 
        };
    var mockedFindMethod = jest.fn((criteria) => {return { toArray: (callback) => { callback(false, [{}]); }}});

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getBy(documentToFind, {})
          .then((objectReturned) => expect(mockedFindMethod).toBeCalledWith({}), (err) => expect(true).toBe(false))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Can getBy a document collection', () => {
    var expectedResult = [{name: 'element1'}, {name: 'element2'}];
    var db = {
        collection: (document) => { return {find: jest.fn((criteria) => { return { toArray: (callback) => { callback(false, expectedResult) }}})}; },
        close: () => {}
    };
    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.getBy('aDocument', {})
           .then((objectReturned) => expect(objectReturned).toBe(expectedResult), (err) => expect(true).toBe(false))
           .catch(() => expect(true).toBe(false));
  });

  pit('After getBy connection must be closed', () => {
    var db = {
        collection: (document) => { return { find: (document) => { return {toArray: (callback) => { callback(false, [{}]); }}}};},
        close: jest.fn(() => {})
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getBy('aDocumentToFind', {})
           .then((result) => expect(db.close).toBeCalled(), (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot insert a childDocument with an undefined rootDocument', () => {
    var undefinedRootDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.insert(undefinedRootDocument, {})
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot insert a childDocument with a null rootDocument', () => {
    var nullRootDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.insert(nullRootDocument, {})
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot insert an undefined childDocument', () => {
    var undefinedChildtDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.insert('rootDocument', undefinedChildtDocument)
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CHILD_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot insert a null childDocument', () => { 
    var nullChildDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.insert('rootDocument', nullChildDocument)
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CHILD_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Collection method from db must be called when insert', () => {
    var rootDocument = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return {insert: jest.fn((childDoc, callback) => { callback(false, {}); })}});
    var db = {collection: mockedCollectionMethod, close: () => {}};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.insert(rootDocument, {})
            .then(() => expect(mockedCollectionMethod).toBeCalledWith(rootDocument), (err) => expect(true).toBe(false))
            .catch((err) => expect(true).toBe(false));
  });

  pit('Insert method from db must be called when insert', () => {
    var mockedInsertMethod = jest.fn((childDoc, callback) => { callback(false, {}); });
    var db = { collection: () => {return {insert: mockedInsertMethod}}, close: () => {}};
    var childDocument = {};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.insert('rootDocument', childDocument)
            .then((msj) => expect(mockedInsertMethod.mock.calls[0][0]).toBe(childDocument), (err) => expect(true).toBe(false))
            .catch((err) => expect(true).toBe(false));
  });

  pit('Insert must execute resolve after inserting', () => {
    var mockedInsertMethod = jest.fn((childDocument, callback) => {callback(false, {})});
    var childDocument = {};
    var db = { collection: () => {return {insert: mockedInsertMethod}}, close: () => {}};
    
    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.insert('rootDocument', childDocument)
            .then((msj) => expect(msj).toBe(PlayerESRepository.DOCUMENT_INSERTED()), (err) => expect(true).toBe(false))
            .catch((err) => expect(true).toBe(false));
  });

  pit('Can insert a child document', () => {
    var rootDocument = 'rootDocument';
    var nameDefined = 'aName'; 
    var documentInserted = {name: nameDefined, surname: 'aSurname', addree: 'aAddress'};
    var db = {
        collection: function(document) {
            return {
              findOne: jest.fn((criteria) => documentInserted),
              insert: jest.fn((document) => {})
            };
        },
        close: () => {}
    };
    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.getOne(rootDocument, {name: nameDefined})
            .then((objReturned) => expect(objReturned).toBe(documentInserted), (err) => expect(true).toBe(false))
            .catch((err) => expect(true).toBe(false));
  });

  pit('Insert must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedDeleteOneThrowsException = jest.fn((document) => {return { insert: function(){ throw new Error(PlayerESRepository.UNEXPECTED_ERROR()); } }});
    var db = {collection: mockedDeleteOneThrowsException, close: () => {}};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.insert(documentToFind, {})
            .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.UNEXPECTED_ERROR()))
            .catch((err) => { expect(true).toBe(false) });
  });

  pit('After insert connection must be closed', () => {
    var db = {
        collection: (document) => { return { insert: (document, callback) => { callback(false, {}) } };},
        close: jest.fn(() => {})
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.insert('aDocumentToFind', {})
           .then((result) => {
                expect(db.close).toBeCalled();
           }, (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot delete document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(false, mockedDb);

    return mongoRep.delete(undefinedDocument, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot delete document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(false, mockedDb);

    return mongoRep.delete(nullDocument, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot delete document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongoRep = new PlayerESRepository('aValidSource');

    mongodb.MongoClient.connect = mockedConnect(false, mockedDb);

    return mongoRep.delete('aDocument', undefinedCriteria)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CRITERIA()))
           .catch((err) => expect(true).toBe(false));  
  });

  pit('Cannot delete document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.delete('aDocument', nullCriteria)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_CRITERIA()))
           .catch((err) => expect(true).toBe(false)); 
  });

  pit('Collection method from db must be called in delete', () => {
    var documentToFind = 'aDocument';
    var db = mockedDb;
    db.collection = jest.fn((document) => { return { deleteOne: baseDeleteOneMethod(false, {}) }});

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.delete(documentToFind, {})
          .then(() => expect(db.collection.mock.calls[0][0]).toBe(documentToFind), (err) => expect(true).toBe(false))
          .catch((err) => expect(true).toBe(false));
  });

  pit('delete must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedDeleteOneThrowsException = jest.fn((document, callback) => { throw new Error(PlayerESRepository.UNEXPECTED_ERROR()); });
    var db = mockedDb;
    db.collection = (document) => { return { deleteOne: mockedDeleteOneThrowsException }};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.delete(documentToFind, {})
            .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.UNEXPECTED_ERROR()))
            .catch((err) => expect(true).toBe(false));
  });

  pit('deleteOne method from db must be called in delete', () => {
    var mockedDeleteOneMethod = jest.fn((document, callback) => callback(false, {}));
    var db = mockedDb;
    db.collection = (document) => { return { deleteOne: mockedDeleteOneMethod }}

    var criteriaToApply = {};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.delete('aDocumentToDelete', criteriaToApply)
          .then(() => expect(mockedDeleteOneMethod.mock.calls[0][0]).toBe(criteriaToApply), (err) => expect(true).toBe(false))
          .catch((err) => expect(true).toBe(false));
  });

  pit('delete must execute reject if db.deleteOne returns error', () => {
    var mockedDeleteOneMethod = jest.fn((document, callback) => callback(true, {}));
    var db = mockedDb;
    db.collection = (document) => {return {deleteOne: mockedDeleteOneMethod}}

    var criteriaToApply = {};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.delete('aDocumentToDelete', criteriaToApply)
          .then(() => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.ERROR_WHILE_DELETING()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('After delete connection must be closed', () => {
    var db = {
      collection: jest.fn((document) => { return {deleteOne: (document, callback) => {callback(false, {})}}}), 
      close: jest.fn(() => {})
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.delete('aDocumentToDelete', {})
           .then((result) => {
                expect(db.close).toBeCalled();
           }, (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot update any document if connection has not beed established', () => {
    var mongoRep = new PlayerESRepository('aValidSource');
    mongodb.MongoClient.connect = mockedConnect(true, mockedDb);

    return mongoRep.update('aDocument', {_id: 'aId'}, {})
          .then((msj) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot update document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.update(undefinedDocument, {_id: 'aId'}, {})
          .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot update document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.update(nullDocument, {_id: 'aId'}, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Cannot update document if a undefined id is passed', () => {
    var undefinedId;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.update('aDocument', undefinedId, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_ID()))
           .catch((err) => expect(true).toBe(false));  
  });

  pit('Cannot update document if a null id is passed', () => {
    var nullId = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.update('aDocument', nullId, {})
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_ID()))
           .catch((err) => expect(true).toBe(false)); 
  });

  pit('Cannot update document if a undefined data to update is passed', () => {
    var undefinedDataToUpdate;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.update('aDocument', {_id: 'anId'}, undefinedDataToUpdate)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DATA_TO_UPDATE()))
           .catch((err) => expect(true).toBe(false));  
  });

  pit('Cannot update document if a null data to update is passed', () => {
    var nullDataToUpdate = null;
    var mongoRep = new PlayerESRepository('aValidSource');

    return mongoRep.update('aDocument', {_id: 'anId'}, nullDataToUpdate)
           .then((objReturned) => expect(true).toBe(false), (err) => expect(err).toBe(PlayerESRepository.INVALID_DATA_TO_UPDATE()))
           .catch((err) => expect(true).toBe(false)); 
  });

  pit('Collection method from db must be called in update', () => {
    var rootDocument = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => { return {update: (id, toUpdate, callback) => { callback(false, {})}}});
    var db = {collection: mockedCollectionMethod, close: () => {}};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.update(rootDocument, {_id: 'anId'}, {})
           .then(() => expect(mockedCollectionMethod.mock.calls[0][0]).toBe(rootDocument), (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Update method from db must be called in update', () => {
    var anId = {_id: 'anId'};
    var toUpdate = {somethigToUpdate: 'somethingToUpdate'};
    var mockedUpdate = jest.fn((id, toUpdate, callback) => {callback(false, {})});
    var db = {
      collection: jest.fn((document) => { return {update: mockedUpdate}}), 
      close: () => {}
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.update('aDocument', anId, toUpdate)
           .then((result) => {
                expect(mockedUpdate.mock.calls[0][0]).toBe(anId);
                expect(mockedUpdate.mock.calls[0][1].$set).toBe(toUpdate);
           }, (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });

  pit('Update must execute reject if an error occurs during update', () => {
    var rootDocument = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => { return {update: (id, toUpdate, callback) => { callback(true, {})}}});
    var db = {collection: mockedCollectionMethod, close: () => {}};

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.update(rootDocument, {_id: 'anId'}, {})
           .then(() => expect(false).toBe(true), (err) => expect(err).toBe(PlayerESRepository.ERROR_WHILE_UPDATING()))
           .catch((err) => expect(false).toBe(true));
  });

  pit('After update connection must be closed', () => {
    var db = {
      collection: jest.fn((document) => { return {update: (id, toUpdate, callback) => {callback(false, {})}}}), 
      close: jest.fn(() => {})
    };

    mongodb.MongoClient.connect = mockedConnect(false, db);

    var mongoRep = new PlayerESRepository('aValidSource');
    return mongoRep.update('aDocument', {_id: 'anId'}, {})
           .then((result) => {
                expect(db.close).toBeCalled();
           }, (err) => expect(true).toBe(false))
           .catch((err) => expect(true).toBe(false));
  });*/
});