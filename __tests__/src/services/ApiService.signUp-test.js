jest.mock('../../../src/models/mappings/UserMap');
jest.unmock('../../../src/services/ApiService');

import ApiService from '../../../src/services/ApiService';

describe('ApiService.signUp', () => {
  var UserMap;

  beforeEach(function() {
     UserMap = require('../../../src/models/mappings/UserMap');
  });

  afterEach(function() {
    UserMap = null;
  });

  pit('Cannot signUp users if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if request is null', () => {
    var nullRequest = null;
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if body request is undefined', () => {
    var undefinedBodyRequest = {
        body: undefined
    };
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(undefinedBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if body request is null', () => {
    var nullBodyRequest = {
        body: null
    };
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(nullBodyRequest)
      .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
      .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if username is undefined', () => {
    var undefinedUsername = {
        body: {
            username: undefined
          }
    };
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(undefinedUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if username is null', () => {
    var nullUsername = { body: { username: null }};
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(nullUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if password is undefined', () => {
    var undefinedPassword = {
        body: {
            username: 'username',
            password: undefined
          }
    };
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(undefinedPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signUp users if password is null', () => {
    var nullPassword = {
        body: {
            username: 'username',
            password: null
          }
    };
    var apiService = new ApiService({}, {}, {}, {});

    return apiService.signUp(nullPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call signUp must use findOne from UserMap by username', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    UserMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)}); 

    var apiService = new ApiService(UserMap, {}, {}, {});

    return apiService.signUp(request)
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

    var apiService = new ApiService(UserMap, {}, {}, {});
    return apiService.signUp(request)
    .then((ret) => expect(false).toBe(true), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          })
    .catch((err) => expect(false).toBe(true));
  });

  pit('If username exists signUp must executes reject', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, user)});

    var apiService = new ApiService(UserMap, {}, {}, {});

    return apiService.signUp(request)
    .then((ret) => { expect(false).toBe(true); }, (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.USERNAME_IS_ALREADY_IN_USE());})
    .catch((err) => expect(false).toBe(true));
  });

  pit('If username does not exist signUp must intantiate UserMap', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    UserMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(false)})}});
    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)});

    var apiService = new ApiService(UserMap, {}, {}, {});

    return apiService.signUp(request)
        .then((ret) => {
              expect(UserMap.mock.instances.length).toBe(1);
              expect(UserMap.mock.calls[0][0].username).toBe(user.username);
              expect(UserMap.mock.calls[0][0].password).toBe(user.password);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If username does not exist signUp must save user', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    var mockedSave = jest.fn((callback) => {callback(false)});
    UserMap = jest.fn(() => {return {save: mockedSave}});
    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)});

    var apiService = new ApiService(UserMap, {}, {}, {});

    return apiService.signUp(request)
        .then((ret) => expect(mockedSave.mock.calls[0][0]).not.toBeUndefined(), (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If save return error must execute reject', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    var mockedSave = jest.fn((callback) => {callback(true)});
    UserMap = jest.fn(() => {return {save: mockedSave}});
    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)});

    var apiService = new ApiService(UserMap, {}, {}, {});

    return apiService.signUp(request)
        .then((ret) => expect(false).toBe(true), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.UNEXPECTED_ERROR());
          })
        .catch((err) => expect(false).toBe(true));
  });

});