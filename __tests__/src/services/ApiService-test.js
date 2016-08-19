jest.unmock('../../../src/services/ApiService');
jest.mock('../../../src/models/mappings/UserMap');
jest.mock('jsonwebtoken');

import ApiService from '../../../src/services/ApiService';

describe('ApiService', () => {

  it('Cannot create ApiService with an undefined UserMap', () => {
    var undefinedUserMap;
  
    expect(() => new ApiService(undefinedUserMap, {}, {}, {})).toThrowError(ApiService.INVALID_USERMAP());
  });

  it('Cannot create ApiService with an null UserMap', () => {
    var nullUserMap;
  
    expect(() => new ApiService(nullUserMap, {}, {}, {})).toThrowError(ApiService.INVALID_USERMAP());
  });

  it('Cannot create ApiService with an undefined PlayerMap', () => {
    var undefinedPlayerMap;
  
    expect(() => new ApiService({}, undefinedPlayerMap, {}, {})).toThrowError(ApiService.INVALID_PLAYERMAP());
  });

  it('Cannot create ApiService with an null PlayerMap', () => {
    var nullPlayerMap;
  
    expect(() => new ApiService({}, nullPlayerMap, {}, {})).toThrowError(ApiService.INVALID_PLAYERMAP());
  });

  it('Cannot create ApiService with an undefined MatchMap', () => {
    var undefinedMatchMap;
  
    expect(() => new ApiService({}, {}, undefinedMatchMap, {})).toThrowError(ApiService.INVALID_MATCHMAP());
  });

  it('Cannot create ApiService with an null MatchMap', () => {
    var nullMatchMap;
  
    expect(() => new ApiService({}, {}, nullMatchMap, {})).toThrowError(ApiService.INVALID_MATCHMAP());
  });

  it('Cannot create ApiService with an undefined jwt', () => {
    var undefinedJwt;
  
    expect(() => new ApiService({}, {}, {}, undefinedJwt)).toThrowError(ApiService.INVALID_JWT());
  });

  it('Cannot create ApiService with an null jwt', () => {
    var nullJwt;
  
    expect(() => new ApiService({}, {}, {}, nullJwt)).toThrowError(ApiService.INVALID_JWT());
  });

  pit('Can login after signUp with a new user', () => {
    /* Que estoy haciendo aca?
       1- Verifico que no pueda hacer LogIn con un usuario que no existe
       2- Verifico que pueda hacer el SignIn correctamente
       3- Verifico que luego del SignIn pueda hacer LogIn correctamente
    */
    var user = {username: 'username', password: 'password'};
    var request = { body: user};
    var token = 'aToken';
    
    var jwt = require('jsonwebtoken');
    var UserMap = require('../../../src/models/mappings/UserMap');
    jwt.sign = jest.fn((object, secret, options) => { return token });

    var mockedSave = jest.fn((callback) => {callback(false)});
    UserMap = jest.fn(() => {return {save: mockedSave}});
    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)});

    var apiService = new ApiService(UserMap, {}, {}, jwt);

    return apiService.login(request)
    .then((ret) => expect(true).toBe(false), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS());

            apiService.signUp(request)
                    .then((ret) => {
                          expect(ret).toBe(ApiService.USER_CREATED());

                          apiService.login(request)
                              .then((ret) => {
                                expect(ret.status).toBe(true);
                                expect(ret.token).toBe(token);
                              }, (ret) => expect(true).toBe(false))
                              .catch((err) => expect(true).toBe(false));
                      }, (ret) => expect(false).toBe(true))
                    .catch((err) => expect(false).toBe(true));
          })
    .catch((err) => expect(true).toBe(false));
  });
});