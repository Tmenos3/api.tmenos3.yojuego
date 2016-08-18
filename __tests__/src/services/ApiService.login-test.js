jest.mock('../../../src/models/mappings/UserMap');
jest.unmock('../../../src/services/ApiService');
jest.mock('jsonwebtoken');

import ApiService from '../../../src/services/ApiService';

var UserMap;

describe('ApiService.login', () => {
  var jwt;
  var config = require('../../../config');

  beforeEach(function() {
    jwt = require('jsonwebtoken');
    UserMap = require('../../../src/models/mappings/UserMap');
  });

  afterEach(function() {
    jwt = null;
  });

  pit('Cannot login users if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if request is null', () => {
    var nullRequest;
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if body request is undefined', () => {
    var undefinedBodyRequest = {
        body: undefined
    };
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(undefinedBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if body request is null', () => {
    var nullBodyRequest = {
        body: null
    };
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(nullBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if username is undefined', () => {
    var undefinedUsername = {
        body: {
            username: undefined
          }
    };
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(undefinedUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if username is null', () => {
    var nullUsername = {
        body: {
            username: null
          }
    };
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(nullUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if password is undefined', () => {
    var undefinedPassword = {
        body: {
            username: 'username',
            password: undefined
          }
    };
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(undefinedPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if password is null', () => {
    var nullPassword = {
        body: {
            username: 'username',
            password: null
          }
    };
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(nullPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call login must use findOne from UserMap by username', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, user)}); 

    var apiService = new ApiService(UserMap, jwt);
    return apiService.login(request)
    .then((ret) => { 
        expect(UserMap.findOne.mock.calls[0][0].username).toBe(user.username);
        expect(UserMap.findOne.mock.calls[0][1]).not.toBeUndefined();
     }, (ret) => expect(false).toBe(true))
    .catch((err) => expect(false).toBe(true));
  });

  pit('if findOne from UserMap return error must execute reject', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    UserMap.findOne = jest.fn((criteria, callback) => {callback(true, null)}); 

    var apiService = new ApiService(UserMap, jwt);
    return apiService.login(request)
    .then((ret) => expect(false).toBe(true), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          })
    .catch((err) => expect(false).toBe(true));
  });

  pit('If username does not exist login must executes reject', () => {
    var request = { body: { username: 'username', password: 'password' }};

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)}); 
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(request)
    .then((ret) => expect(false).toBe(true), (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS()); })
    .catch((err) => expect(false).toBe(true));
  });

  pit('If password does not match login must executes reject', () => {
    var userWithOtherPassword = {username: 'username', password: 'otherPassword'};
    var request = { body: { username: 'username', password: 'password' }};

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, userWithOtherPassword)}); 
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(request)
    .then((ret) => expect(true).toBe(false), (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS());
     })
    .catch((err) => expect(true).toBe(false));
  });

  pit('If password match login must generate token', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user};
    var token = 'aToken';

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, user)});
    jwt.sign = jest.fn((object, secret, options) => { return token });
    var apiService = new ApiService(UserMap, jwt);

    return apiService.login(request)
    .then((ret) => {
      expect(jwt.sign.mock.calls[0][0].username).toBe(user.username);
      expect(jwt.sign.mock.calls[0][0].password).toBe(user.password);
      expect(jwt.sign.mock.calls[0][1]).toBe(config.secret);
      expect(jwt.sign.mock.calls[0][2].expiresIn).toBe(config.expiresIn);

      expect(ret.status).toBe(true);
      expect(ret.token).toBe(token);
    }, (ret) => expect(true).toBe(false))
    .catch((err) => expect(true).toBe(false));
  });
});