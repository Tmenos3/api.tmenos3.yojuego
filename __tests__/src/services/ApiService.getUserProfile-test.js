jest.mock('../../../src/repositories/MongoRepository');
jest.unmock('../../../src/services/ApiService');
jest.mock('jsonwebtoken');
jest.mock('../../../config');

import ApiService from '../../../src/services/ApiService';

var MongoRepository;

describe('ApiService.getUserProfile', () => {
  var mongoRep;
  var jwt;
  var config;
  var getMockedVerify = jest.fn((err, decoded) => { return jest.fn((token, secret, callback) => { callback(err, decoded); }); });
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

  pit('when getUserProfile must call _verifyAuthentication', () => {
    var user = {_id: 'existantIdUser'};
    var req = { headers: { authorization: 'token' }};
    mongoRep.getOne = mockedGetOne(user);

    var apiService = new ApiService(mongoRep, {});
    apiService._verifyAuthentication = jest.fn((req) => { return new Promise((resolve, reject) => { resolve({id: 'decodedInfo'}); })});

    return apiService.getUserProfile(req)
    .then((ret) => expect(apiService._verifyAuthentication).toBeCalled(), (ret) => expect(false).toBe(true))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile if id is undefined', () => {
    var req = { headers: { authorization: 'token' }};
    jwt.verify = getMockedVerify(false, {id: undefined});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUserProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile if idUser is null', () => {
    var nullIdUser = { headers: { authorization: 'token' }};

    jwt.verify = getMockedVerify(false, {idUser: null});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUserProfile(nullIdUser)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call getUserProfile must find idUser in repo', () => {
    var idUser = {id: 'oijsjdofuah9'};
    var request = { headers: { authorization: 'token' }};

    mongoRep.getOne = mockedGetOne({profile: {}});
    
    jwt.verify = getMockedVerify(false, idUser);
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUserProfile(request)
        .then((ret) => { 
              expect(mongoRep.getOne.mock.calls[0][0]).toBe('users');
              expect(mongoRep.getOne.mock.calls[0][1]._id).toBe(idUser.id);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If users does not exist getUserProfile must executes reject', () => {
    var request = { headers: { authorization: 'token' }};
    mongoRep.getOne = mockedGetOne(null);

    jwt.verify = getMockedVerify(false, {id: 'inexistantUserId'});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUserProfile(request)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.UNAUTHORIZED()); })
    .catch((err) => expect(false).toBe(true));
  });

  pit('If user exists getUserProfile must execute resolve with user profile', () => {
    var user = {
      _id: 'existantIdUser',
      profile: { nickname: 'validNickname' }
    };
    var request = { headers: { authorization: 'token' }};

    mongoRep.getOne = mockedGetOne(user);

    jwt.verify = getMockedVerify(false, {id: user._id});
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.getUserProfile(request)
        .then((ret) => {
              expect(mongoRep.getOne.mock.calls[0][0]).toBe('users');
              expect(mongoRep.getOne.mock.calls[0][1]._id).toBe(user._id);
              expect(ret.nickname).toBe(user.profile.nickname);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });
});