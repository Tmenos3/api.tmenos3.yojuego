jest.mock('../../../src/repositories/MongoRepository');
jest.unmock('../../../src/services/ApiService');
jest.mock('jsonwebtoken');

import ApiService from '../../../src/services/ApiService';

var MongoRepository;

describe('ApiService', () => {
  var mongoRep;
  var jwt;
  var config = require('../../../config');

  beforeEach(function() {
    jwt = require('jsonwebtoken');

    MongoRepository = require('../../../src/repositories/MongoRepository');
    mongoRep = new MongoRepository('validSource');
    mongoRep.getOne = jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({}); })});
  });

  afterEach(function() {
    mongoRep = null;
    jwt = null;
  });

  it('Cannot create ApiService with an undefined repo', () => {
    var undefinedRepo;
  
    expect(() => new ApiService(undefinedRepo)).toThrowError(ApiService.INVALID_REPOSITORY());
  });

  it('Cannot create ApiService with an null repo', () => {
    var nullRepo;
  
    expect(() => new ApiService(nullRepo)).toThrowError(ApiService.INVALID_REPOSITORY());
  });

  it('Cannot create ApiService with an undefined jwt', () => {
    var undefinedJwt;
  
    expect(() => new ApiService({}, undefinedJwt)).toThrowError(ApiService.INVALID_JWT());
  });

  it('Cannot create ApiService with an null jwt', () => {
    var nullJwt;
  
    expect(() => new ApiService({}, nullJwt)).toThrowError(ApiService.INVALID_JWT());
  });

  pit('Cannot login users if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.login(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if request is null', () => {
    var nullRequest;
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.login(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if body request is undefined', () => {
    var undefinedBodyRequest = {
        body: undefined
    };
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.login(undefinedBodyRequest)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_REQUEST_BODY()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('Cannot login users if body request is null', () => {
    var nullBodyRequest = {
        body: null
    };
    var apiService = new ApiService(mongoRep, jwt);

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
    var apiService = new ApiService(mongoRep, jwt);

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
    var apiService = new ApiService(mongoRep, jwt);

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
    var apiService = new ApiService(mongoRep, jwt);

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
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.login(nullPassword)
    .then((ret) => expect(false).toBe(true), (ret) => expect(ret).toBe(ApiService.INVALID_CREDENTIALS()))
    .catch((err) => expect(false).toBe(true));
  });

  pit('When call login must find username in repo', () => {
    var username = 'username';
    var request = {
        body: {
            username: username,
            password: 'password'
          }
    };

    var apiService = new ApiService(mongoRep, jwt);
    return apiService.login(request)
    .then((ret) => { 
        expect(mongoRep.get.mock.calls[0][0]).toBe('users');
        expect(mongoRep.get.mock.calls[0][1].username).toBe(username);
     }, (ret) => {  })
    .catch((err) => {  });
  });

  pit('If username does not exist login must executes reject', () => {
    var request = {
        body: {
            username: 'username',
            password: 'password'
          }
    };

    var apiService = new ApiService(mongoRep, jwt);

    return apiService.login(request)
    .then((ret) => { expect(false).toBe(true); }, (ret) => { 
      expect(ret.status).toBe(false);
      expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS()); })
    .catch((err) => { expect(false).toBe(true); });
  });

  pit('If password does not match login must executes reject', () => {
    var userWithOtherPassword = {username: 'username', password: 'otherPassword'};

    var request = { body: { username: 'username', password: 'password' }};

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(userWithOtherPassword); })});
    var apiService = new ApiService(mongoRep, jwt);

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

    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve(user); })});
    jwt.sign = jest.fn((object, secret, options) => { return token });
    var apiService = new ApiService(mongoRep, jwt);

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