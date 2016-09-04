import SignUpRoutes from '../../../src/routes/SignUpRoutes';

describe('SignUpRoutes', () => {
    it('Can add all routes', () => {
        let serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { })
        };
        let signUpRoutes = new SignUpRoutes();
        signUpRoutes.add(serverMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(2);
        expect(serverMocked.post.mock.calls.length).toEqual(3);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/signUp/facebook/callback');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/signUp/google/callback');
        expect(serverMocked.post.mock.calls[0][0]).toEqual('/signUp/local');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/signUp/facebook');
        expect(serverMocked.post.mock.calls[2][0]).toEqual('/signUp/google');
    });
});