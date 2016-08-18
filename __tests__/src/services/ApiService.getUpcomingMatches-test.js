jest.mock('../../../src/repositories/MongoRepository');
jest.unmock('../../../src/services/ApiService');
jest.unmock('moment');
jest.mock('jsonwebtoken');
jest.mock('../../../config');

import ApiService from '../../../src/services/ApiService';

var MongoRepository;

describe('ApiService.getUpcomingMatches', () => {
  var moment = require('moment');
  var mongoRep;
  var jwt;
  var config;
  var getMockedVerify = jest.fn((err, decoded) => { return jest.fn((token, secret, callback) => { callback(err, decoded); }); });
  var mockedGetBy = jest.fn((toReturn) => jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(toReturn); })}));
  var mockedGetOne = jest.fn((toReturn) => jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(toReturn); })}));

  beforeEach(function() {
     MongoRepository = require('../../../src/repositories/MongoRepository');
     mongoRep = new MongoRepository('validSource');
     mongoRep.getOne = jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({}); })});
     jwt = require('jsonwebtoken');
     jwt.verify = getMockedVerify(false, {id: 'anyId'});
     config = require('../../../config');
  });

  afterEach(function() {
    mongoRep = null;
    jwt = null;
  });

  pit('when getUpcomingMatches must call _verifyAuthentication', () => {
    var user = {_id: 'existantIdUser', _idUser: '57b4c0b06e2540cc1f734f40'};
    var req = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    mongoRep.getOne = mockedGetOne(user);
    mongoRep.getBy = mockedGetBy([{}]);

    var apiService = new ApiService(mongoRep, {});
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: user._idUser}); })});

    return apiService.getUpcomingMatches(req)
    .then((ret) => expect(apiService._verifyAuthentication).toBeCalled(), (ret) => expect(false).toBe(true))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if id is undefined', () => {
    var req = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    mongoRep.getOne = mockedGetOne({_id: 'asdfa'});
    mongoRep.getBy = mockedGetBy([{}]);
    jwt.verify = getMockedVerify(false, {id: undefined});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if id is null', () => {
    var req = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    mongoRep.getOne = mockedGetOne({_id: 'asdfa'});
    mongoRep.getBy = mockedGetBy([{}]);
    jwt.verify = getMockedVerify(false, {id: null});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if paramsRequest is undefined', () => {
    var undefinedParamsReq = { 
      headers: { authorization: 'token' },
      params: undefined
    };
    jwt.verify = getMockedVerify(false, {id: 'anId'});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(undefinedParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST_PARAMS());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if paramsRequest is null', () => {
    var nullParamsReq = { 
      headers: { authorization: 'token' },
      params: null
    };
    jwt.verify = getMockedVerify(false, {id: 'anId'});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(nullParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST_PARAMS());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if paramsRequest.datefrom is undefined', () => {
    var undefinedParamsReq = { 
      headers: { authorization: 'token' },
      params: {datefrom: undefined}
    };
    jwt.verify = getMockedVerify(false, {id: 'anId'});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(undefinedParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_DATEFROM());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => {console.log('3- err: ' + err); expect(false).toBe(true)});
  });

  pit('Cannot getUpcomingMatches if paramsRequest.datefrom is null', () => {
    var nullParamsReq = { 
      headers: { authorization: 'token' },
      params: {datefrom: undefined}
    };
    jwt.verify = getMockedVerify(false, {id: 'anId'});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(nullParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_DATEFROM());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if paramsRequest.datefrom is not a valid ISO8601 format', () => {
    var nullParamsReq = { 
      headers: { authorization: 'token' },
      params: {datefrom: 'invalidFormat'}
    };
    jwt.verify = getMockedVerify(false, {id: 'anId'});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUpcomingMatches(nullParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_DATEFROM());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call getUpcomingMatches must find player in repo', () => {
    var player = {idUser: '57b4c0b06e2540cc1f734f40'};
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    mongoRep.getOne = mockedGetOne(player);
    mongoRep.getBy = mockedGetBy({profile: {}});
    
    var apiService = new ApiService(mongoRep, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: player.idUser}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => { 
              expect(mongoRep.getOne.mock.calls[0][0]).toBe('players');
              expect(mongoRep.getOne.mock.calls[0][1]._idUser.toString()).toBe(player.idUser.toString());
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If player does not exist getUpcomingMatches must execute reject', () => {
    var inexistantPlayer = null;
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    mongoRep.getOne = mockedGetOne(inexistantPlayer);
    
    var apiService = new ApiService(mongoRep, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: '57b4c0b06e2540cc1f734f40'}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => expect(false).toBe(true), (ret) => {
          expect(ret.message).toBe(ApiService.UNAUTHORIZED());
          expect(ret.code).toBe(401);
          expect(ret.status).toBe(false);
        })
        .catch((err) => expect(false).toBe(true));
  });

  pit('After find player getUpcomingMatches must find matches with date bigger than todat', () => {
    var player = {_id: 'oihrpgasrf', _idUser: '57b4c0b06e2540cc1f734f40'};
    var today = moment().toISOString();
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: today}
    };

    mongoRep.getOne = mockedGetOne(player);
    mongoRep.getBy = mockedGetBy([{}]);
    
    var apiService = new ApiService(mongoRep, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: player._idUser}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => { 
              expect(mongoRep.getOne.mock.calls[0][0]).toBe('players');
              expect(mongoRep.getOne.mock.calls[0][1]._idUser.toString()).toBe(player._idUser.toString());
              expect(mongoRep.getBy.mock.calls[0][0]).toBe('matches');
              expect(mongoRep.getBy.mock.calls[0][1].datetime.$gte).toBe(today);
              expect(mongoRep.getBy.mock.calls[0][1].confirms[0]).toBe(player._id);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });
});