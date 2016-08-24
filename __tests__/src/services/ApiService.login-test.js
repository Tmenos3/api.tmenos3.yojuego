jest.mock('../../../src/models/mappings/UserMap');
jest.mock('../../../src/models/mappings/PlayerMap');
jest.unmock('../../../src/services/ApiService');

import ApiService from '../../../src/services/ApiService';


describe('ApiService.login', () => {
  var config = require('../../../config');
  var UserMap;
  var PlayerMap;

  beforeEach(function() {
    UserMap = require('../../../src/models/mappings/UserMap');
    PlayerMap = require('../../../src/models/mappings/PlayerMap');
  });

  afterEach(function() {
    UserMap = null;
    PlayerMap = null;
  });

  pit('Cannot login users if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService({}, {}, {});

    return apiService.login(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()));
  });

  pit('Cannot login users if request is null', () => {
    var nullRequest;
    var apiService = new ApiService({}, {}, {});

    return apiService.login(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()));
  });

  pit('Cannot login users if body request is undefined', () => {
    var undefinedBodyRequest = {
        body: undefined
    };
    var apiService = new ApiService({}, {}, {});

    return apiService.login(undefinedBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()));
  });

  pit('Cannot login users if body request is null', () => {
    var nullBodyRequest = {
        body: null
    };
    var apiService = new ApiService({}, {}, {});

    return apiService.login(nullBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()));
  });

  pit('Cannot login users if username is undefined', () => {
    var undefinedUsername = {
        body: {
            username: undefined
          }
    };
    var apiService = new ApiService({}, {}, {});

    return apiService.login(undefinedUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()));
  });

  pit('Cannot login users if username is null', () => {
    var nullUsername = {
        body: {
            username: null
          }
    };
    var apiService = new ApiService({}, {}, {});

    return apiService.login(nullUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()));
  });

  pit('Cannot login users if password is undefined', () => {
    var undefinedPassword = {
        body: {
            username: 'username',
            password: undefined
          }
    };
    var apiService = new ApiService({}, {}, {});

    return apiService.login(undefinedPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()));
  });

  pit('Cannot login users if password is null', () => {
    var nullPassword = {
        body: {
            username: 'username',
            password: null
          }
    };
    var apiService = new ApiService({}, {}, {});

    return apiService.login(nullPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()));
  });

  pit('When call login must use findOne from UserMap by username', () => {
    var CryptoJS = require('crypto-js');
    var config = require('../../../config');
    var user = {_id: 'anId', username: 'username', password: 'password'};
    var player = {_id: 'playerId', _idUser: user._id, profile: {nickname: 'nickname'}};
    var userSaved = {username: user.username, password: CryptoJS.AES.encrypt(user.password, config.secret)};
    var request = { body: user };

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, userSaved)});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, player)});

    var apiService = new ApiService(UserMap, PlayerMap, {});

    return apiService.login(request)
    .then((ret) => { 
        expect(UserMap.findOne.mock.calls[0][0].username).toEqual(user.username);
        expect(UserMap.findOne.mock.calls[0][1]).not.toBeUndefined();
     }, (ret) => {console.log('ret: ' + JSON.stringify(ret)); expect(false).toBe(true); });
  });

  pit('if findOne from UserMap return error must execute reject', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    UserMap.findOne = jest.fn((criteria, callback) => {callback(true, null)}); 

    var apiService = new ApiService(UserMap, {}, {});
    return apiService.login(request)
    .then((ret) => expect(false).toBe(true), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          });
  });

  pit('If username does not exist login must executes reject', () => {
    var request = { body: { username: 'username', password: 'password' }};

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)}); 
    var apiService = new ApiService(UserMap, {}, {});

    return apiService.login(request)
    .then((ret) => expect(false).toBe(true), (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS());
    });
  });

  pit('If password does not match login must executes reject', () => {
    var userWithOtherPassword = {username: 'username', password: 'otherPassword'};
    var request = { body: { username: 'username', password: 'password' }};

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, userWithOtherPassword)}); 
    var apiService = new ApiService(UserMap, {}, {});

    return apiService.login(request)
    .then((ret) => expect(true).toBe(false), (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS());
     });
  });

  pit('If password match login must return info for token and player', () => {
    var CryptoJS = require('crypto-js');
    var config = require('../../../config');
    var user = {_id: 'anId', username: 'username', password: 'password'};
    var player = {_id: 'playerId', _idUser: user._id, profile: {nickname: 'nickname'}};
    var userSaved = {_id: user._id, username: user.username, password: CryptoJS.AES.encrypt(user.password, config.secret)};
    var request = { body: user};

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, userSaved)});
    PlayerMap.findOne = jest.fn((criteria, callback) => {callback(false, player)});
    var apiService = new ApiService(UserMap, PlayerMap, {});

    return apiService.login(request)
    .then((ret) => {
      expect(ret.id).toEqual(user._id);
      expect(ret.player._id).toEqual(player._id);
      expect(ret.player._idUser).toEqual(player._idUser);
      expect(ret.player.profile).toEqual(player.profile);
    }, (ret) => expect(true).toBe(false));
  });
});