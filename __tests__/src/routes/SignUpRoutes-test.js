import SignUpRoutes from '../../../src/routes/SignUpRoutes';
jest.mock('passport-facebook', () => {
    return {
        Strategy: jest.fn((params, callback) => {
            return {
                clientID: params.clientID,
                clientSecret: params.clientSecret,
                callbackURL: params.callbackURL,
            };
        })
    }
});
jest.mock('passport-local', () => {
    return {
        Strategy: jest.fn((params, callback) => {
            return {
                usernameField: params.usernameField,
                passwordField: params.passwordField,
                passReqToCallback: params.passReqToCallback,
            };
        })
    }
});
jest.mock('elasticsearch', () => {
    return {
        Client: jest.fn((params) => {
            return {
                search: jest.fn((criteria, callback) => { })
            }
        })
    }
});
jest.mock('../../../src/repositories/PlayerESRepository', () => {
    return jest.fn((client) => {
        return {
            getBy: jest.fn((criteria) => {
                return new Promise((resolve, reject) => {
                    resolve([{ account: { mail: 'anyMail' } }]);
                });
            })
        }
    })

});

describe('SignUpRoutes', () => {
    let config = require('../../../config');
    let serverMocked;
    let passportMocked;

    beforeEach(() => {
        serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { }),
            use: jest.fn((obj) => { })
        };

        passportMocked = {
            serializeUser: jest.fn((callback) => { }),
            authenticate: jest.fn((type) => { return jest.fn((req, res, next) => { }); }),
            use: jest.fn((strategy, callback) => { })
        }
    });

    afterEach(() => {
        serverMocked = null;
        passportMocked = null;
    });

    it('Cannot add routes with an undefined server', () => {
        let undefinedServer;
        let routes = new SignUpRoutes();

        expect(() => routes.add(undefinedServer)).toThrowError(SignUpRoutes.INVALID_SERVER);
    });

    it('Cannot add routes with an null server', () => {
        let nullServer = null;
        let routes = new SignUpRoutes();

        expect(() => routes.add(nullServer)).toThrowError(SignUpRoutes.INVALID_SERVER);
    });

    it('Cannot add routes with an undefined passport', () => {
        let undefinedPassport;
        let routes = new SignUpRoutes();

        expect(() => routes.add({}, undefinedPassport)).toThrowError(SignUpRoutes.INVALID_PASSPORT);
    });

    it('Cannot add routes with an null passport', () => {
        let nullPassport = null;
        let routes = new SignUpRoutes();

        expect(() => routes.add({}, nullPassport)).toThrowError(SignUpRoutes.INVALID_PASSPORT);
    });

    it('Before add routes it must configure passport', () => {
        let signUpRoutes = new SignUpRoutes();
        signUpRoutes.add(serverMocked, passportMocked);

        expect(passportMocked.use.mock.calls.length).toEqual(2);
        expect(passportMocked.serializeUser.mock.calls.length).toEqual(1);
        expect(passportMocked.use.mock.calls[0][0]).toEqual('facebook');
        expect(passportMocked.use.mock.calls[0][1].clientID).toEqual(config.facebook.appId);
        expect(passportMocked.use.mock.calls[0][1].clientSecret).toEqual(config.facebook.appSecret);
        expect(passportMocked.use.mock.calls[0][1].callbackURL).toEqual(config.facebook.callback);
        expect(passportMocked.use.mock.calls[1][0]).toEqual('local');
        expect(passportMocked.use.mock.calls[1][1].usernameField).toEqual('email');
        expect(passportMocked.use.mock.calls[1][1].passwordField).toEqual('password');
        expect(passportMocked.use.mock.calls[1][1].passReqToCallback).toEqual(true);
    });

    it('Can add all routes', () => {
        let signUpRoutes = new SignUpRoutes();
        signUpRoutes.add(serverMocked, passportMocked);

        expect(serverMocked.get.mock.calls.length).toEqual(2);
        expect(serverMocked.post.mock.calls.length).toEqual(3);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/signUp/facebook/callback');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/signUp/google/callback');
        expect(serverMocked.post.mock.calls[0][0]).toEqual('/signUp/local');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/signUp/facebook');
        expect(serverMocked.post.mock.calls[2][0]).toEqual('/signUp/google');
    });

//     it('when signUp local it must return statusCode 400 if mail exist', () => {
//         //It must search by email into repo and return 400 if exist
//         var repo = require('../../../src/repositories/PlayerESRepository');
//         let req = {};
//         let signUpRoutes = new SignUpRoutes();
//         let done = jest.fn((err, user) => { });
//         done({}, null);

//         signUpRoutes._signUpLocal(req, 'anyMail', 'password', done);
// console.log('done.mock.calls.length: ' + JSON.stringify(done.mock.calls.length));
//         expect(done.mock.calls[1][0].code).toEqual(400);
//         expect(done.mock.calls[1][0].message).toEqual('La cuenta está en uso');
//         expect(req.statusCode).toEqual(400);
//         expect(req.statusMessage).toEqual('La cuenta está en uso');
//     });
});