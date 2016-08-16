jest.mock('../../../src/repositories/MongoRepository');
jest.unmock('../../../src/services/ApiService');

import ApiService from '../../../src/services/ApiService';

var MongoRepository;

describe('ApiService.getUserProfile', () => {
  var mongoRep;

  beforeEach(function() {
     MongoRepository = require('../../../src/repositories/MongoRepository');
     mongoRep = new MongoRepository('validSource');
  });

  afterEach(function() {
    mongoRep = null;
  });

  pit('Cannot getUserProfile if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile users if request is null', () => {
    var nullRequest = null;
    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile if params request is undefined', () => {
    var undefinedParamsRequest = {
        params: undefined
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(undefinedParamsRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_PARAMS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile if params request is null', () => {
    var nullParamsRequest = {
        params: null
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(nullParamsRequest)
      .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_PARAMS()))
      .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile if idUser is undefined', () => {
    var undefinedIdUser = {
        params: {
            idUser: undefined
          }
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(undefinedIdUser)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_ID_USER()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot getUserProfile if idUser is null', () => {
    var nullIdUser = {
        params: {
            idUser: null
          }
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(nullIdUser)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_ID_USER()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call getUserProfile must find idUser in repo', () => {
    var idUser = {idUser: 'oijsjdofuah9'};
    var request = { params: idUser };

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({profile: {}}); })});

    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(request)
        .then((ret) => { 
              expect(mongoRep.getOne.mock.calls[0][0]).toBe('users');
              expect(mongoRep.getOne.mock.calls[0][1]._id).toBe(idUser.idUser);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If users does not exist getUserProfile must executes reject', () => {
    var request = { params: {idUser: 'nonExistantIdUser'} };

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(null); })});

    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(request)
    .then((ret) => expect(false).toBe(true), (ret) => {
      console.log('1- ret: ' + ret); 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.USER_DOES_NOT_EXIST()); })
    .catch((err) => { console.log('2- err: ' + err); expect(false).toBe(true); });
  });

  pit('If user exists getUserProfile must execute resolve with user profile', () => {
    var user = {
      _id: 'existantIdUser',
      profile: {
        nickname: 'validNickname'
      }
    };
    var request = { params: {idUser: user._id} };

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(user); })});

    var apiService = new ApiService(mongoRep, {});

    return apiService.getUserProfile(request)
        .then((ret) => {
              expect(mongoRep.insert.mock.calls[0][0]).toBe('users');
              expect(mongoRep.insert.mock.calls[0][1].idUser).toBe(user._id);
              expect(ret._id).toBe(user._id);
              expect(ret.userProfile.nickname).toBe(user.userProfile.nickname);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

});