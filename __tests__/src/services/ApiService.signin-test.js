jest.mock('../../../src/repositories/MongoRepository');
jest.unmock('../../../src/services/ApiService');

import ApiService from '../../../src/services/ApiService';

var MongoRepository;

describe('ApiService.signin', () => {
  var mongoRep;

  beforeEach(function() {
     MongoRepository = require('../../../src/repositories/MongoRepository');
     mongoRep = new MongoRepository('validSource');
    //mongoRep.getOne = jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({}); })});
  });

  afterEach(function() {
    mongoRep = null;
  });

  pit('Cannot signin users if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if request is null', () => {
    var nullRequest = null;
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if body request is undefined', () => {
    var undefinedBodyRequest = {
        body: undefined
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(undefinedBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if body request is null', () => {
    var nullBodyRequest = {
        body: null
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(nullBodyRequest)
      .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
      .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if username is undefined', () => {
    var undefinedUsername = {
        body: {
            username: undefined
          }
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(undefinedUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if username is null', () => {
    var nullUsername = {
        body: {
            username: null
          }
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(nullUsername)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if password is undefined', () => {
    var undefinedPassword = {
        body: {
            username: 'username',
            password: undefined
          }
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(undefinedPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot signin users if password is null', () => {
    var nullPassword = {
        body: {
            username: 'username',
            password: null
          }
    };
    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(nullPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call signin must find username in repo', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({}); })});

    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(request)
        .then((ret) => { 
              expect(mongoRep.getOne.mock.calls[0][0]).toBe('users');
              expect(mongoRep.getOne.mock.calls[0][1].username).toBe(user.username);
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

  pit('If username exists signin must executes reject', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(user); })});

    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(request)
    .then((ret) => { expect(false).toBe(true); }, (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.USERNAME_IS_ALREADY_IN_USE()); })
    .catch((err) => { expect(false).toBe(true); });
  });

  pit('If username does not exist signin must insert the user', () => {
    var user = {username: 'username', password: 'password'};
    var request = { body: user };

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({}); })});
    mongoRep.insert =  jest.fn((rootDocument, childDocument) => {return new Promise((resolve, reject) => { resolve('inserted'); })});

    var apiService = new ApiService(mongoRep, {});

    return apiService.signin(request)
        .then((ret) => {
              expect(mongoRep.insert.mock.calls[0][0]).toBe('users');
              expect(mongoRep.insert.mock.calls[0][1].username).toBe(user.username);
              expect(mongoRep.insert.mock.calls[0][1].password).toBe(user.password);
              expect(ret).toBe(ApiService.USER_CREATED());
          }, (ret) => expect(false).toBe(true))
        .catch((err) => expect(false).toBe(true));
  });

});