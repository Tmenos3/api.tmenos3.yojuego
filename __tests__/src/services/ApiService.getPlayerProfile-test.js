jest.mock('../../../src/models/mappings/PlayerMap');
jest.unmock('../../../src/services/ApiService');
jest.mock('../../../config');

import ApiService from '../../../src/services/ApiService';

var MongoRepository;

describe('ApiService.getPlayerProfile', () => {
  var PlayerMap;
  var config;
  var getMockedVerify = jest.fn((err, decoded) => { return jest.fn((token, secret, callback) => { callback(err, decoded); }); });

  beforeEach(function() {
     PlayerMap = require('../../../src/models/mappings/PlayerMap');
     config = require('../../../config');
  });

  afterEach(function() {
    PlayerMap = null;
  });

  pit('Cannot getPlayerProfile if req is undefined', () => {
    var req = undefined;

    var apiService = new ApiService({}, {}, {});

    return apiService.getPlayerProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    });
  });

  pit('Cannot getPlayerProfile if req is null', () => {
    var req = null;

    var apiService = new ApiService({}, {}, {});

    return apiService.getPlayerProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    });
  });

  pit('Cannot getPlayerProfile if req.user is undefined', () => {
    var req = { user: undefined };

    var apiService = new ApiService({}, {}, {});

    return apiService.getPlayerProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST_USER());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    });
  });

  pit('Cannot getPlayerProfile if req.user is null', () => {
    var req = { user: null };

    var apiService = new ApiService({}, {}, {});

    return apiService.getPlayerProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST_USER());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    });
  });

  pit('Cannot getPlayerProfile if req.user.id is undefined', () => {
    var req = { user: { id: undefined }};

    var apiService = new ApiService({}, {}, {});

    return apiService.getPlayerProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    });
  });

  pit('Cannot getPlayerProfile if req.user.id is null', () => {
    var req = { user: { id: null }};

    var apiService = new ApiService({}, {}, {});

    return apiService.getPlayerProfile(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(400);
      expect(ret.status).toBe(false);
    });
  });

  pit('When call getPlayerProfile must use PlayerMap.findOne with idUser', () => {
    var idUser = {id: 'oijsjdofuah9'};
    var request = { user: { id: idUser.id }};

    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, {})}); 
    
    var apiService = new ApiService({}, PlayerMap, {});

    return apiService.getPlayerProfile(request)
        .then((ret) => { 
              expect(PlayerMap.findOne.mock.calls[0][0]._idUser).toBe(idUser.id);
              expect(PlayerMap.findOne.mock.calls[0][1]).not.toBeUndefined();
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If PlayerMap.findOne return error must execute reject', () => {
    var idUser = {id: 'oijsjdofuah9'};
    var request = { user: { id: idUser.id }};

    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(true, {})}); 
    
    var apiService = new ApiService({}, PlayerMap, {});

    return apiService.getPlayerProfile(request)
    .then((ret) => expect(false).toBe(true), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          })
    .catch((err) => expect(false).toBe(true));
  });

  pit('If users does not exist getPlayerProfile must executes reject', () => {
    var request = { user: { id: 'notExistantId' }};
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, null)}); 

    var apiService = new ApiService({}, PlayerMap, {});

    return apiService.getPlayerProfile(request)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.UNAUTHORIZED()); })
    .catch((err) => expect(false).toBe(true));
  });

  pit('If user exists getPlayerProfile must execute resolve with user profile', () => {
    var user = {
      _id: 'existantIdUser',
      profile: { nickname: 'validNickname' }
    };
    var request = { user: { id: user._id }};

    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, user)}); 

    var apiService = new ApiService({}, PlayerMap, {});

    return apiService.getPlayerProfile(request)
        .then((ret) => {
              expect(PlayerMap.findOne.mock.calls[0][0]._idUser).toBe(user._id);
              expect(ret.nickname).toBe(user.profile.nickname);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });
});