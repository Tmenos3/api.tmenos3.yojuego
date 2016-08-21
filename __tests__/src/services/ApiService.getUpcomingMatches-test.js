jest.mock('../../../src/models/mappings/PlayerMap');
jest.mock('../../../src/models/mappings/MatchMap');
jest.unmock('../../../src/services/ApiService');
jest.unmock('moment');
jest.mock('jsonwebtoken');
jest.mock('../../../config');

import ApiService from '../../../src/services/ApiService';

describe('ApiService.getUpcomingMatches', () => {
  var PlayerMap;
  var MatchMap;
  var moment = require('moment');
  var jwt;
  var config;
  var getMockedVerify = jest.fn((err, decoded) => { return jest.fn((token, secret, callback) => { callback(err, decoded); }); });
  var mockedFindBy = jest.fn((toReturn) => jest.fn((criteria, callback) => {callback(false, toReturn)}));
  var mockedFindOne = jest.fn((toReturn) => jest.fn((criteria, callback) => {callback(false, toReturn)}));

  beforeEach(function() {
     PlayerMap = require('../../../src/models/mappings/PlayerMap');
     PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, {})});
     MatchMap = require('../../../src/models/mappings/MatchMap');

     jwt = require('jsonwebtoken');
     jwt.verify = getMockedVerify(false, {id: 'anyId'});
     config = require('../../../config');
  });

  afterEach(function() {
    PlayerMap = null;
    MatchMap = null;
    jwt = null;
  });

  pit('when getUpcomingMatches must call _verifyAuthentication', () => {
    var player = {_id: 'existantIdUser', _idUser: '57b4c0b06e2540cc1f734f40'};
    var req = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, player)}); 
    MatchMap.find = jest.fn((criteria, callback) => {callback(false, [{}])}); 

    var apiService = new ApiService({}, PlayerMap, MatchMap, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: player._idUser}); })});

    return apiService.getUpcomingMatches(req)
    .then((ret) => expect(apiService._verifyAuthentication).toBeCalled(), (ret) => expect(false).toBe(true))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if id is undefined', () => {
    var req = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    jwt.verify = getMockedVerify(false, {id: undefined});
    var apiService = new ApiService({}, {}, {}, jwt);

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

    jwt.verify = getMockedVerify(false, {id: null});
    var apiService = new ApiService({}, {}, {}, jwt);

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
    var apiService = new ApiService({}, {}, {}, jwt);

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
    var apiService = new ApiService({}, {}, {}, jwt);

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
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService.getUpcomingMatches(undefinedParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_DATEFROM());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUpcomingMatches if paramsRequest.datefrom is null', () => {
    var nullParamsReq = { 
      headers: { authorization: 'token' },
      params: {datefrom: undefined}
    };
    jwt.verify = getMockedVerify(false, {id: 'anId'});
    var apiService = new ApiService({}, {}, {}, jwt);

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
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService.getUpcomingMatches(nullParamsReq)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_DATEFROM());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call getUpcomingMatches must use findOne from PlayerMap by _userId', () => {
    var player = {idUser: '57b4c0b06e2540cc1f734f40'};
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, player)});
    MatchMap.find = jest.fn((criteria, callback) => {callback(false, [{}])});  
    
    var apiService = new ApiService({}, PlayerMap, MatchMap, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: player.idUser}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => { 
              expect(PlayerMap.findOne.mock.calls[0][0]._idUser).toBe(player.idUser);
              expect(PlayerMap.findOne.mock.calls[0][1]).not.toBeUndefined();
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If player does not exist getUpcomingMatches must execute reject', () => {
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, null)}); 
    
    var apiService = new ApiService({}, PlayerMap, {}, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: '57b4c0b06e2540cc1f734f40'}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => expect(false).toBe(true), (ret) => {
          expect(ret.message).toBe(ApiService.UNAUTHORIZED());
          expect(ret.code).toBe(401);
          expect(ret.status).toBe(false);
        })
        .catch((err) => expect(false).toBe(true));
  });

  pit('If PlayerMap.findOne returns error must execute reject', () => {
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: moment().toISOString()}
    };

    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(true, null)}); 
    
    var apiService = new ApiService({}, PlayerMap, {}, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: '57b4c0b06e2540cc1f734f40'}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => expect(false).toBe(true), (ret) => {
          expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          expect(ret.status).toBe(false);
        })
        .catch((err) => expect(false).toBe(true));
  });

  pit('After find player getUpcomingMatches must use find from MatchMap by confirmed and datetime', () => {
    var player = {_id: 'oihrpgasrf', _idUser: '57b4c0b06e2540cc1f734f40'};
    var today = moment().toISOString();
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: today}
    };

    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, player)}); 
    MatchMap.find = jest.fn((criteria, callback) => {callback(false, [{}])}); 
    
    var apiService = new ApiService({}, PlayerMap, MatchMap, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: player._idUser}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => { 
              expect(MatchMap.find.mock.calls[0][0].datetime.$gte).toBe(today);
              expect(MatchMap.find.mock.calls[0][0].confirmed[0]).toBe(player._id);
              expect(MatchMap.find.mock.calls[0][1]).not.toBeUndefined();
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If find from MatchMap returns error must execute reject', () => {
    var player = {_id: 'oihrpgasrf', _idUser: '57b4c0b06e2540cc1f734f40'};
    var today = moment().toISOString();
    var request = { 
      headers: { authorization: 'token' },
      params: { datefrom: today}
    };

    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, player)}); 
    MatchMap.find = jest.fn((criteria, callback) => {callback(true, null)}); 
    
    var apiService = new ApiService({}, PlayerMap, MatchMap, jwt);
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: player._idUser}); })});

    return apiService.getUpcomingMatches(request)
        .then((ret) => expect(false).toBe(true), (ret) => {
          expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          expect(ret.status).toBe(false);
        })
        .catch((err) => expect(false).toBe(true));
  });
});