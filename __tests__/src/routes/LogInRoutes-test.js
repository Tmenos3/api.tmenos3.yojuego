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

    it('Can add all routes', () => {
        let logInRoutes = new LogInRoutes();
        logInRoutes.add(serverMocked, passportMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(5);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/login/facebook/callback');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/login/google/callback');
        expect(serverMocked.get.mock.calls[2][0]).toEqual('/login/yojuego');
        expect(serverMocked.get.mock.calls[3][0]).toEqual('/login/facebook');
        expect(serverMocked.get.mock.calls[4][0]).toEqual('/login/google');
    });
});