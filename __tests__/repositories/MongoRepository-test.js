//jest.unmock('../../repositories/MongoRepository');

import MongoRepository from '../../repositories/MongoRepository';

describe('MongoRepository', () => {
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

  it('If the source is valid connect returns true', () => {
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository("aValidUrl");

    expect(mongoRep.connect()).toEqual(true);
  });

  it('If the source is invalid connect returns false', () => {
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(false, {}));

    var mongoRep = new MongoRepository("anInvalidUrl");

    expect(mongoRep.connect()).toEqual(false);
  });

  it('The connection must be done with the source it has been created', () => {
    var aValidSource = 'aValidSource';
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository(aValidSource);
    mongoRep.connect();

    expect(mongodb.MongoClient.connect.mock.calls[0][0]).toEqual(aValidSource);
  });

  it('isConnected returns true if connection has been established', () => {
    var mongodb = require('mongodb');
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    expect(mongoRep.isConnected()).toBe(true);
  });

  it('isConnected returns false if connection has not been established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    expect(mongoRep.isConnected()).toBe(false);
  });

  it('Can close a connection still when it has not been established', () => {
    var mongodb = require('mongodb');
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    mongoRep.closeConnection();

    expect(mongoRep.isConnected()).toBe(false);
  });

  it('Can close a connection when it has been established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    mongoRep.closeConnection();

    expect(mongoRep.isConnected()).toBe(false);
  });

  it('Cannot insert any document if connection has not beed established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.insert({})).toThrowError(MongoRepository.CONNECTION_NOT_ESTABLISHED());
  });

  it('Cannot update any document if connection has not beed established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.update({})).toThrowError(MongoRepository.CONNECTION_NOT_ESTABLISHED());
  });

  it('Cannot delete any document if connection has not beed established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.delete({})).toThrowError(MongoRepository.CONNECTION_NOT_ESTABLISHED());
  });

  it('Cannot get any document if connection has not beed established', () => {
    var mongoRep = new MongoRepository('aValidSource');

    expect(() => mongoRep.get('aDocument', {})).toThrowError(MongoRepository.CONNECTION_NOT_ESTABLISHED());
  });

  it('Cannot get document if a undefined document is passed', () => {
    var undefinedDocument;
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    expect(() => mongoRep.get(undefinedDocument, {})).toThrowError(MongoRepository.INVALID_DOCUMENT());
  });

  it('Cannot get document if a null document is passed', () => {
    var nullDocument = null;
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    expect(() => mongoRep.get(nullDocument, {})).toThrowError(MongoRepository.INVALID_DOCUMENT());
  });

  it('Cannot get document if a undefined criteria is passed', () => {
    var undefinedCriteria;
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    expect(() => mongoRep.get('aDocument', undefinedCriteria)).toThrowError(MongoRepository.INVALID_CRITERIA());
  });

  it('Cannot get document if a null criteria is passed', () => {
    var nullCriteria = null;
    var mongodb = require('mongodb');

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    expect(() => mongoRep.get('aDocument', nullCriteria)).toThrowError(MongoRepository.INVALID_CRITERIA());
  });

  it('Collection method from db must be called in get', () => {
    var documentToFind = 'aDocument';
    var mongodb = require('mongodb');
    var mockedCollectionMethod = jest.fn((document) => {return {find: function(){}}});

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, {collection: mockedCollectionMethod}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    mongoRep.get(documentToFind, {});

    expect(mockedCollectionMethod).toBeCalledWith(documentToFind);
  });

  it('Find method from db must be called in get', () => {
    var documentToFind = 'aDocument';
    var mongodb = require('mongodb');
    var mockedFindMethod = jest.fn((criteria) => {});

    var criteriaToApply = {};

    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, { collection: function(){return {find: mockedFindMethod}}}));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    mongoRep.get(documentToFind, criteriaToApply);

    expect(mockedFindMethod).toBeCalledWith(criteriaToApply);
  });

  it('Can get a document collection', () => {
    var expectedResult = [{name: 'element1'}, {name: 'element2'}];
    var mongodb = require('mongodb');
    var db = {
        collection: function(document) {
            return {find: jest.fn((criteria) => expectedResult)};
        }
    };
    mongodb.MongoClient.connect = jest.fn((aUrl, aFunction) => aFunction(true, db));

    var mongoRep = new MongoRepository('aValidSource');
    mongoRep.connect();

    expect(mongoRep.get('aDocument', {})).toBe(expectedResult);
  });
});