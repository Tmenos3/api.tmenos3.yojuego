jest.unmock('../../../src/services/ApiService');
jest.mock('../../../src/repositories/MongoRepository');
jest.mock('jsonwebtoken');

import ApiService from '../../../src/services/ApiService';

describe('ApiService', () => {

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

  pit('Can login after signin with a new user', () => {
    /* Que estoy haciendo aca?
       1- Verifico que no pueda hacer LogIn con un usuario que no existe
       2- Verifico que pueda hacer el SignIn correctamente
       3- Verifico que luego del SignIn pueda hacer LogIn correctamente
    */
    var user = {username: 'username', password: 'password'};
    var request = { body: user};
    var token = 'aToken';
    
    var jwt = require('jsonwebtoken');
    var MongoRepository = require('../../../src/repositories/MongoRepository');
    var mongoRep = new MongoRepository('validSource');
    mongoRep.getOne =  jest.fn((document, criteria) => {return new Promise((resolve, reject) => { resolve({}); })});
    jwt.sign = jest.fn((object, secret, options) => { return token });
    var apiService = new ApiService(mongoRep, jwt);

    return apiService.login(request)
    .then((ret) => expect(true).toBe(false), 
          (ret) => {
            expect(ret.status).toBe(false);
            expect(ret.message).toBe(ApiService.INVALID_CREDENTIALS());

            apiService.signin(request)
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