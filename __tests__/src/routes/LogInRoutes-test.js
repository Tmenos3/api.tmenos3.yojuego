import LogInRoutes from '../../../src/routes/LogInRoutes';

describe('LogInRoutes', () => {
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
        let routes = new LogInRoutes();

        expect(() => routes.add(undefinedServer)).toThrowError(LogInRoutes.INVALID_SERVER);
    });

    it('Cannot add routes with an null server', () => {
        let nullServer = null;
        let routes = new LogInRoutes();

        expect(() => routes.add(nullServer)).toThrowError(LogInRoutes.INVALID_SERVER);
    });

    it('Cannot add routes with an undefined passport', () => {
        let undefinedPassport;
        let routes = new LogInRoutes();

        expect(() => routes.add({}, undefinedPassport)).toThrowError(LogInRoutes.INVALID_PASSPORT);
    });

    it('Cannot add routes with an null passport', () => {
        let nullPassport = null;
        let routes = new LogInRoutes();

        expect(() => routes.add({}, nullPassport)).toThrowError(LogInRoutes.INVALID_PASSPORT);
    });

    it('Before add routes it must configure passport', () => {
        let signUpRoutes = new LogInRoutes();
        signUpRoutes.add(serverMocked, passportMocked);

        expect(passportMocked.use.mock.calls.length).toEqual(1);
        // expect(passportMocked.use.mock.calls[0][0]).toEqual('facebook-signup');
        // expect(passportMocked.use.mock.calls[0][1].clientID).toEqual(config.facebook.appId);
        // expect(passportMocked.use.mock.calls[0][1].clientSecret).toEqual(config.facebook.appSecret);
        // expect(passportMocked.use.mock.calls[0][1].callbackURL).toEqual(config.facebook.callback);
        console.log('parameter: ' + JSON.stringify(passportMocked.use.mock.calls[0][1]));
        expect(passportMocked.use.mock.calls[0][0]).toEqual('yojuego-login');
        expect(passportMocked.use.mock.calls[0][1]._usernameField).toEqual('email');
        expect(passportMocked.use.mock.calls[0][1]._passwordField).toEqual('password');
        expect(passportMocked.use.mock.calls[0][1]._passReqToCallback).toEqual(true);
    });

    it('Can add all routes', () => {
        let logInRoutes = new LogInRoutes();
        logInRoutes.add(serverMocked, passportMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(1);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/login/yojuego');
    });
});