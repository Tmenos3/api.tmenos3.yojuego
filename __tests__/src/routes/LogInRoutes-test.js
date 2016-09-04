import LogInRoutes from '../../../src/routes/LogInRoutes';

describe('LogInRoutes', () => {
    it('Can add all routes', () => {
        let serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { })
        };
        let logInRoutes = new LogInRoutes();
        logInRoutes.add(serverMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(2);
        expect(serverMocked.post.mock.calls.length).toEqual(3);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/logIn/facebook/callback');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/logIn/google/callback');
        expect(serverMocked.post.mock.calls[0][0]).toEqual('/logIn/local');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/logIn/facebook');
        expect(serverMocked.post.mock.calls[2][0]).toEqual('/logIn/google');
    });
});