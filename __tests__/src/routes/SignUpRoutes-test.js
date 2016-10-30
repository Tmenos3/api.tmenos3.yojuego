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

        expect(passportMocked.use.mock.calls.length).toEqual(1);
        expect(passportMocked.use.mock.calls[0][0]).toEqual('yojuego-signup');
        expect(passportMocked.use.mock.calls[0][1].usernameField).toEqual('email');
        expect(passportMocked.use.mock.calls[0][1].passwordField).toEqual('password');
        expect(passportMocked.use.mock.calls[0][1].passReqToCallback).toEqual(true);
    });

    it('Can add all routes', () => {
        let signUpRoutes = new SignUpRoutes();
        signUpRoutes.add(serverMocked, passportMocked);

        expect(serverMocked.get.mock.calls.length).toEqual(1);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/signup/yojuego');
    });
});