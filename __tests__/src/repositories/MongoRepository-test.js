jest.mock('mongodb');

import MongoRepository from '../../../src/repositories/MongoRepository';

describe('MongoRepository', () => {
  var mongodb;

  beforeEach(function() {
    mongodb = require('mongodb');
  });

  afterEach(function() {
    mongodb = null;
  });

  it('Cannot create with a source undefined', () => {
    var undefinedSource;
  
    expect(() => new MongoRepository(undefinedSource)).toThrowError(MongoRepository.INVALID_SOURCE());
  });

  it('Cannot create with a source null', () => {
    var nullSource = null;
  
    expect(() => new MongoRepository(nullSource)).toThrowError(MongoRepository.INVALID_SOURCE());
  });

  it('Can create a valid MongoRepository', () => {
    var url = 'aValidUrl';
    var mongoRep = new MongoRepository(url);

    expect(mongoRep.source).toEqual(url);
  });

  pit('Connect must execute the resolve callback if connection succesful', () => {
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    var mongoRep = new MongoRepository("aValidUrl");
    
    return mongoRep._connect()
    .then((db) => expect(db).not.toBeNull(), (err) => expect(true).toBe(false))
    .catch((err) => expect(true).toBe(false));
  });

  pit('Connect must execute the reject callback if connection fail', () => {
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository("anInvalidUrl");

    return mongoRep._connect()
          .then((db) => expect(false).toBeTruthy(), (err) => expect(err).toEqual(MongoRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('The connection must be done with the source it has been created', () => {
    var aValidSource = 'aValidSource';
    var mongoRep = new MongoRepository(aValidSource);

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep._connect()
    .then((db) => expect(mongodb.MongoClient.connect.mock.calls[0][0]).toEqual(aValidSource), (err) => expect(true).toBe(false))
    .catch((err) => expect(false).toBeTruthy());
  });

  pit('Insert executes reject callback if connection is not established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    return mongoRep.insert('rootDocument', {})
          .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Update executes reject callback if connection is not established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.update( {})
          .then((msj) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Delete executes reject callback if connection is not established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    return mongoRep.delete('aDocument', {})
          .then((msj) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot get any document if connection has not beed established', () => {
    var mongoRep = new MongoRepository('aValidSource');
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    return mongoRep.get('aDocument', {})
          .then((msj) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot get document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep.get(undefinedDocument, {})
          .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot get document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep.get(nullDocument, {})
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot get document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep.get('aDocument', undefinedCriteria)
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_CRITERIA()))
           .catch((err) => expect(false).toBeTruthy());  
  });

  pit('Cannot get document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.get('aDocument', nullCriteria)
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_CRITERIA()))
           .catch((err) => expect(false).toBeTruthy()); 
  });

  pit('Collection method from db must be called in get', () => {
    var documentToFind = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return {find: (criteria) => { return {}; }}});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {collection: mockedCollectionMethod, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.get(documentToFind, {})
           .then((objectReturned) => expect(mockedCollectionMethod).toBeCalledWith(documentToFind), (err) => expect(false).toBeTruthy())
           .catch((err) => expect(false).toBeTruthy());
  });

  pit('Get must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedGetThrowsException = jest.fn((document) => {return { find: (criteria) => { throw new Error(MongoRepository.UNEXPECTED_ERROR()); }, close: () => {} }});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {collection: mockedGetThrowsException}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.get(documentToFind, {})
          .then((objectReturned) => expect(true).toBe(false), (err) => expect(err).toBe(MongoRepository.UNEXPECTED_ERROR()))
          .catch((err) => { expect(true).toBe(false) });
  });

  pit('Find method from db must be called in get', () => {
    var documentToFind = 'aDocument';
    var db = { collection: (document) => { return { find: mockedFindMethod }},
               close: () => {} 
        };
    var mockedFindMethod = jest.fn((criteria) => {});

    var criteriaToApply = {};

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, db));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.get(documentToFind, criteriaToApply)
          .then((objectReturned) => {console.log('1'); expect(mockedFindMethod).toBeCalledWith(criteriaToApply); }, (err) => {console.log('2 - err: ' + err); expect(false).toBeTruthy(); })
          .catch((err) => {console.log('3 - err: ' + err); expect(false).toBeTruthy(); });
  });

  pit('Can get a document collection', () => {
    var expectedResult = [{name: 'element1'}, {name: 'element2'}];
    var db = {
        collection: (document) => { return {find: jest.fn((criteria) => expectedResult) }; },
        close: () => {}
    };
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, db));

    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.get('aDocument', {})
           .then((objectReturned) => expect(objectReturned).toBe(expectedResult), (err) => expect(false).toBeTruthy())
           .catch(() => expect(false).toBeTruthy());
  });

  pit('Cannot insert a childDocument with an undefined rootDocument', () => {
    var undefinedRootDocument;
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.insert(undefinedRootDocument, {})
          .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot insert a childDocument with a null rootDocument', () => {
    var nullRootDocument = null;
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.insert(nullRootDocument, {})
          .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_DOCUMENT()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot insert an undefined childDocument', () => {
    var undefinedChildtDocument;
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.insert('rootDocument', undefinedChildtDocument)
          .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_CHILD_DOCUMENT()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot insert a null childDocument', () => { 
    var nullChildDocument = null;
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.insert('rootDocument', nullChildDocument)
          .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_CHILD_DOCUMENT()))
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Collection method from db must be called when insert', () => {
    var rootDocument = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {collection: mockedCollectionMethod, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.insert(rootDocument, {})
            .then(() => expect(mockedCollectionMethod).toBeCalledWith(rootDocument), (err) => expect(false).toBeTruthy())
            .catch((err) => expect(false).toBeTruthy());
  });

  pit('Insert method from db must be called when insert', () => {
    var mockedInsertMethod = jest.fn((childDocument) => {});
    var childDocument = {};

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, { collection: function(){return {insert: mockedInsertMethod}}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.connect()
          .then((msj) => mongoRep.insert('rootDocument', childDocument)
                         .then((msj) => expect(mockedInsertMethod).toBeCalledWith(childDocument), (err) => expect(false).toBeTruthy())
                         .catch((err) => expect(false).toBeTruthy()), 
                (err) => expect(false).toBeTruthy())
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Insert must execute resolve after inserting', () => {
    var mockedInsertMethod = jest.fn((childDocument) => {});
    var childDocument = {};

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, { collection: function(){return {insert: mockedInsertMethod}}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.connect()
          .then((msj) => mongoRep.insert('rootDocument', childDocument)
                         .then((msj) => expect(msj).toBe(MongoRepository.DOCUMENT_INSERTED()), (err) => expect(false).toBeTruthy())
                         .catch((err) => expect(false).toBeTruthy()), 
                (err) => expect(false).toBeTruthy())
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('Can insert a child document', () => {
    var rootDocument = 'rootDocument';
    var nameDefined = 'aName'; 
    var documentInserted = {name: nameDefined, surname: 'aSurname', addree: 'aAddress'};
    var db = {
        collection: function(document) {
            return {
              find: jest.fn((criteria) => documentInserted),
              insert: jest.fn((document) => {})
            };
        },
        close: () => {}
    };
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, db));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.get(rootDocument, {name: nameDefined})
            .then((objReturned) => expect(objReturned).toBe(documentInserted), (err) => expect(false).toBeTruthy())
            .catch((err) => expect(false).toBeTruthy());
  });

  pit('Insert must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedDeleteOneThrowsException = jest.fn((document) => {return { insert: function(){ throw new Error(MongoRepository.UNEXPECTED_ERROR()); } }});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {collection: mockedDeleteOneThrowsException, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.insert(documentToFind, {})
            .then(() => expect(true).toBe(false), (err) => expect(err).toBe(MongoRepository.UNEXPECTED_ERROR()))
            .catch((err) => { expect(true).toBe(false) });
  });

  pit('Cannot delete document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep.delete(undefinedDocument, {})
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot delete document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep.delete(nullDocument, {})
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_DOCUMENT()))
           .catch((err) => expect(false).toBeTruthy());
  });

  pit('Cannot delete document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongoRep = new MongoRepository('aValidSource');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    return mongoRep.delete('aDocument', undefinedCriteria)
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_CRITERIA()))
           .catch((err) => expect(false).toBeTruthy());  
  });

  pit('Cannot delete document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongoRep = new MongoRepository('aValidSource');

    return mongoRep.delete('aDocument', nullCriteria)
           .then((objReturned) => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.INVALID_CRITERIA()))
           .catch((err) => expect(false).toBeTruthy()); 
  });

  pit('Collection method from db must be called in delete', () => {
    var documentToFind = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return { deleteOne: (childDocument, callback) => {} }});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {collection: mockedCollectionMethod, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.delete(documentToFind, {})
          .then(() => expect(mockedCollectionMethod).toBeCalledWith(documentToFind), (err) => expect(false).toBeTruthy())
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('delete must execute reject if an exception occurs', () => {
    var documentToFind = 'aDocument';
    var mockedDeleteOneThrowsException = jest.fn((document) => {return { deleteOne: function(document, callback){ throw new Error(MongoRepository.UNEXPECTED_ERROR()); } }});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {collection: mockedDeleteOneThrowsException, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.delete(documentToFind, {})
            .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.UNEXPECTED_ERROR()))
            .catch((err) => expect(false).toBeTruthy());
  });

  pit('deleteOne method from db must be called in delete', () => {
    var documentToDelete = 'aDocument';
    var mockedDeleteOneMethod = jest.fn((document, callback) => callback(false, {}));

    var criteriaToApply = {};

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, { collection: function(document){return {deleteOne: mockedDeleteOneMethod}}, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.delete(documentToDelete, criteriaToApply)
          .then(() => expect(mockedDeleteOneMethod.mock.calls[0][0]).toBe(criteriaToApply), (err) => expect(false).toBeTruthy())
          .catch((err) => expect(false).toBeTruthy());
  });

  pit('delete must execute reject if db.deleteOne returns error', () => {
    var documentToDelete = 'aDocument';
    var mockedDeleteOneMethod = jest.fn((document, callback) => callback(true, {}));

    var criteriaToApply = {};

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, { collection: function(){return {deleteOne: mockedDeleteOneMethod}}, close: () => {}}));

    var mongoRep = new MongoRepository('aValidSource');
    return mongoRep.delete(documentToDelete, criteriaToApply)
          .then(() => expect(false).toBeTruthy(), (err) => expect(err).toBe(MongoRepository.ERROR_WHILE_DELETING()))
          .catch((err) => expect(false).toBeTruthy());
  });

  //testear en todos los casos que se llame al dl.close
});