jest.unmock('../../../src/services/ApiService');
jest.mock('jsonwebtoken');
jest.mock('../../../config');

import ApiService from '../../../src/services/ApiService';

describe('ApiService._verifyAuthentication', () => {
  var jwt;
  var config;
  var getMockedVerify = jest.fn((err, decoded) => { return jest.fn((token, secret, callback) => { callback(err, decoded); }); });

  beforeEach(function() {
     jwt = require('jsonwebtoken');
     jwt.verify = getMockedVerify(false, {id: 'anyId'});
     config = require('../../../config');
  });

  afterEach(function() {
    jwt = null;
  });

  pit('_verifyAuthentication executes reject if request is undefined', () => {
    var undefinedRequest;
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService._verifyAuthentication(undefinedRequest)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => {console.log('err: ' + err); expect(false).toBe(true)});
  });

  pit('_verifyAuthentication executes reject if request is null', () => {
    var nullRequest = null;
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService._verifyAuthentication(nullRequest)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication executes reject if headerRequest is undefined', () => {
    var undefinedHeaderRequest = {headers: undefined};
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService._verifyAuthentication(undefinedHeaderRequest)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST_HEADER());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication executes reject if headerRequest is null', () => {
    var nullHeaderRequest = {headers: null};
    var apiService = new ApiService({}, {}, {}, {});

    return apiService._verifyAuthentication(nullHeaderRequest)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.INVALID_REQUEST_HEADER());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication executes reject if headerRequest authorization is undefined', () => {
    var undefinedHeaderRequestAuthorization = {headers: { authorization: undefined }};
    var apiService = new ApiService({}, {}, {}, {});

    return apiService._verifyAuthentication(undefinedHeaderRequestAuthorization)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication executes reject if headerRequest authorization is null', () => {
    var nullHeaderRequestAuthorization = {headers: { authorization: null }};
    var apiService = new ApiService({}, {}, {}, {});

    return apiService._verifyAuthentication(nullHeaderRequestAuthorization)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication must call jwtVerify with given token', () => {
    var anyToken = 'anyToken';
    var request = { headers: { authorization: anyToken }};
    jwt.verify = getMockedVerify(false, {id: 'id'});
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService._verifyAuthentication(request)
    .then((ret) => {
      expect(jwt.verify.mock.calls[0][0]).toEqual(anyToken);
      expect(jwt.verify.mock.calls[0][1]).toEqual(config.secret);
    }, (ret) => expect(false).toBe(true))
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication executes reject if authorization token is not valid', () => {
    var req = { headers: { authorization: 'notValidToken' }};
    jwt.verify = getMockedVerify(true, 'undecodedToken');
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService._verifyAuthentication(req)
    .then((ret) => expect(false).toBe(true), (ret) => {
      expect(ret.message).toBe(ApiService.UNAUTHORIZED());
      expect(ret.code).toBe(401);
      expect(ret.status).toBe(false);
    })
    .catch((err) => expect(false).toBe(true));
  });

  pit('_verifyAuthentication executes resolve if authorization token is valid', () => {
    var decoded = {decoded: 'decodedInfo'}
    var req = { headers: { authorization: 'validToken' }};
    jwt.verify = getMockedVerify(false, decoded);
    var apiService = new ApiService({}, {}, {}, jwt);

    return apiService._verifyAuthentication(req)
    .then((ret) => expect(ret.decoded).toEqual(decoded.decoded), (ret) => expect(false).toBe(true))
    .catch((err) => expect(false).toBe(true));
  });
});