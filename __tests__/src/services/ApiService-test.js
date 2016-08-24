jest.unmock('../../../src/services/ApiService');
jest.mock('../../../src/models/mappings/UserMap');

import ApiService from '../../../src/services/ApiService';

describe('ApiService', () => {

  it('Cannot create ApiService with an undefined UserMap', () => {
    var undefinedUserMap;
  
    expect(() => new ApiService(undefinedUserMap, {}, {})).toThrowError(ApiService.INVALID_USERMAP());
  });

  it('Cannot create ApiService with an null UserMap', () => {
    var nullUserMap;
  
    expect(() => new ApiService(nullUserMap, {}, {})).toThrowError(ApiService.INVALID_USERMAP());
  });

  it('Cannot create ApiService with an undefined PlayerMap', () => {
    var undefinedPlayerMap;
  
    expect(() => new ApiService({}, undefinedPlayerMap, {})).toThrowError(ApiService.INVALID_PLAYERMAP());
  });

  it('Cannot create ApiService with an null PlayerMap', () => {
    var nullPlayerMap;
  
    expect(() => new ApiService({}, nullPlayerMap, {})).toThrowError(ApiService.INVALID_PLAYERMAP());
  });

  it('Cannot create ApiService with an undefined MatchMap', () => {
    var undefinedMatchMap;
  
    expect(() => new ApiService({}, {}, undefinedMatchMap)).toThrowError(ApiService.INVALID_MATCHMAP());
  });

  it('Cannot create ApiService with an null MatchMap', () => {
    var nullMatchMap;
  
    expect(() => new ApiService({}, {}, nullMatchMap)).toThrowError(ApiService.INVALID_MATCHMAP());
  });

  pit('Can login after signUp with a new user', () => {
    /* Que estoy haciendo aca?
       1- Verifico que no pueda hacer LogIn con un usuario que no existe
       2- Verifico que pueda hacer el SignIn correctamente
       3- Verifico que luego del SignIn pueda hacer LogIn correctamente
    */
    var user = {username: 'username', password: 'password'};
    var request = { body: user};
    
    var UserMap = require('../../../src/models/mappings/UserMap');
    var PlayerMap = require('../../../src/models/mappings/PlayerMap');

    var mockedSave = jest.fn((callback) => {callback(false)});
    PlayerMap = jest.fn(() => {return {save: jest.fn((callback) => {callback(true)})}});
    UserMap = jest.fn(() => {return {
      save: jest.fn(() => {return {save: mockedSave}}),
      _id: idUser,
      username: user.username
    }});
    UserMap.findOne = jest.fn((criteria, callback) => {callback(false, null)});

    var apiService = new ApiService(UserMap, PlayerMap, {});

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
                                expect(ret.username).toBe(user.username);
                                expect(ret.password).toBe(user.password);
                              }, (ret) => expect(true).toBe(false));
                      }, (ret) => expect(false).toBe(true));
          });
  });
});