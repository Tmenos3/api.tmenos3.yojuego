jest.mock('mongodb');

import MongoRepository from '../../repositories/MongoRepository';

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

  it('Connect must execute the resolve callback if connection succesful', () => {
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository("aValidUrl");
    
    mongoRep.connect()
    .then((msj) => {expect(msj).toEqual(MongoRepository.CONNECTION_ESTABLISHED())}, (err) => {expect(true).toBe(false)})
    .catch((err) => {expect(true).toBe(false)});
  });

  it('Connect must execute the reject callback if connection fail', () => {
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    var mongoRep = new MongoRepository("anInvalidUrl");

    mongoRep.connect()
    .then((msj) => { expect(true).toBe(false) }, (err) => { expect(msj).toEqual(MongoRepository.CONNECTION_NOT_ESTABLISHED()) })
    .catch((err) => { expect(true).toBe(false) });
  });

  it('The connection must be done with the source it has been created', () => {
    var aValidSource = 'aValidSource';
    var mongoRep = new MongoRepository(aValidSource);

    mongoRep.connect()
    .then((msj) => { expect(mongodb.MongoClient.connect.mock.calls[0][0]).toEqual(aValidSource) }, (err) => { expect(true).toBe(false) })
    .catch((err) => { expect(true).toBe(false)});
  });

  it('Closeconnection must execute close method from db', () => {
    var db = {close: jest.fn(() => {})};
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, db));

    var mongoRep = new MongoRepository('aValidSource');

    mongoRep.closeConnection()
    .then((msj) => { expect(db.close).toBeCalled() }, (err) => { expect(true).toBe(false) })
    .catch((err) => { expect(true).toBe(false)});
  });

  it('Insert executes reject callback if connection is not established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongoRep.insert('rootDocument', {})
    .then((msj) => { expect(true).toBe(false) }, (err) => { expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED())})
    .catch((err) => { expect(true).toBe(false) });
  });

  it('Update executes reject callback if connection is not established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongoRep.update( {})
    .then((msj) => { expect(true).toBe(false) }, (err) => { expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED())})
    .catch((err) => { expect(true).toBe(false) });
  });

  it('Delete executes reject callback if connection is not established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongoRep.delete( {})
    .then((msj) => { expect(true).toBe(false) }, (err) => { expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED())})
    .catch((err) => { expect(true).toBe(false) });
  });

  it('Cannot get any document if connection has not beed established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongoRep.get('aDocument', {})
    .then((msj) => { expect(true).toBe(false) }, (err) => { expect(err).toBe(MongoRepository.CONNECTION_NOT_ESTABLISHED())})
    .catch((err) => { expect(true).toBe(false) });
  });

  it('Cannot get document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.get(undefinedDocument, {})).toThrowError(MongoRepository.INVALID_DOCUMENT());
  });

  it('Cannot get document if a null document is passed', () => {
    var nullDocument = null;
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.get(nullDocument, {})).toThrowError(MongoRepository.INVALID_DOCUMENT());
  });

  it('Cannot get document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.get('aDocument', undefinedCriteria)).toThrowError(MongoRepository.INVALID_CRITERIA());
  });

  it('Cannot get document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.get('aDocument', nullCriteria)).toThrowError(MongoRepository.INVALID_CRITERIA());
  });

  it('Collection method from db must be called in get', () => {
    var documentToFind = 'aDocument';
    var mockedCollectionMethod = jest.fn((document) => {return {find: function(){}}});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {collection: mockedCollectionMethod}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect()
    .then(() =>  mongoRep.get(documentToFind, {})
                .then(() => expect(mockedCollectionMethod).toBeCalledWith(documentToFind), (err) => { expect(true).toBe(false) })
                .catch((err) => { expect(true).toBe(false) }), 
          (err) => { expect(true).toBe(false) })
    .catch((err) => { expect(true).toBe(false) });
  });

  //cuando hago el get tengo que ejecutar el resolve
  //si hay un error debo ejecutar el reject

  // it('Find method from db must be called in get', () => {
  //   var documentToFind = 'aDocument';
  //   var mockedFindMethod = jest.fn((criteria) => {});

  //   var criteriaToApply = {};

  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, { collection: function(){return {find: mockedFindMethod}}}));

  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   mongoRep.get(documentToFind, criteriaToApply);

  //   expect(mockedFindMethod).toBeCalledWith(criteriaToApply);
  // });

  // it('Can get a document collection', () => {
  //   var expectedResult = [{name: 'element1'}, {name: 'element2'}];
  //   var db = {
  //       collection: function(document) {
  //           return {find: jest.fn((criteria) => expectedResult)};
  //       }
  //   };
  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, db));

  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   expect(mongoRep.get('aDocument', {})).toBe(expectedResult);
  // });

  // it('Cannot insert a childDocument with an undefined rootDocument', () => {
  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

  //   var undefinedRootDocument;
  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   expect(() => mongoRep.insert(undefinedRootDocument, {})).toThrowError(MongoRepository.INVALID_DOCUMENT());
  // });

  // it('Cannot insert a childDocument with a null rootDocument', () => {
  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

  //   var nullRootDocument = null;
  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   expect(() => mongoRep.insert(nullRootDocument, {})).toThrowError(MongoRepository.INVALID_DOCUMENT());
  // });

  // it('Cannot insert an undefined childDocument', () => {
  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

  //   var undefinedChildtDocument;
  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   expect(() => mongoRep.insert('rootDocument', undefinedChildtDocument)).toThrowError(MongoRepository.INVALID_CHILD_DOCUMENT());
  // });

  // it('Cannot insert a null childDocument', () => {
  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));
    
  //   var nullChildDocument = null;
  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   expect(() => mongoRep.insert('rootDocument', nullChildDocument)).toThrowError(MongoRepository.INVALID_CHILD_DOCUMENT());
  // });

  // it('Collection method from db must be called when insert', () => {
  //   var rootDocument = 'aDocument';
  //   var mockedCollectionMethod = jest.fn((document) => {return {insert: function(childDocument){}}});

  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {collection: mockedCollectionMethod}));

  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   mongoRep.insert(rootDocument, {});

  //   expect(mockedCollectionMethod).toBeCalledWith(rootDocument);
  // });

  // it('Insert method from db must be called when insert', () => {
  //   var mockedInsertMethod = jest.fn((criteria) => {});
  //   var childDocument = {};

  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, { collection: function(){return {insert: mockedInsertMethod}}}));

  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();

  //   mongoRep.insert('rootDocument', childDocument);

  //   expect(mockedInsertMethod).toBeCalledWith(childDocument);
  // });

  // it('Can insert a child document', () => {
  //   var rootDocument = 'rootDocument';
  //   var nameDefined = 'aName'; 
  //   var documentInserted = {name: nameDefined, surname: 'aSurname', addree: 'aAddress'};
  //   var db = {
  //       collection: function(document) {
  //           return {
  //             find: jest.fn((criteria) => documentInserted),
  //             insert: jest.fn(() => {})
  //           };
  //       }
  //   };
  //   mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, db));
    
  //   var mongoRep = new MongoRepository('aValidSource');
  //   mongoRep.connect();
  //   mongoRep.insert(rootDocument, documentInserted);

  //   expect(mongoRep.get(rootDocument, {name: nameDefined})).toBe(documentInserted);
  // });
});