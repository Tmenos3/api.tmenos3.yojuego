import Router from '../../../src/routes/Router';

describe('Router', () => {
    it('Can add all routes', () => {
        let serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { }),
            delete: jest.fn((url, callback) => { })
        };
        let router = new Router();
        router.addAll(serverMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(9);
        expect(serverMocked.post.mock.calls.length).toEqual(12);
        expect(serverMocked.delete.mock.calls.length).toEqual(3);

        expect(serverMocked.get.mock.calls[0][0]).toEqual('/invitation/:id');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/logIn/facebook/callback');
        expect(serverMocked.get.mock.calls[2][0]).toEqual('/logIn/google/callback');
        expect(serverMocked.get.mock.calls[3][0]).toEqual('/match/:id');
        expect(serverMocked.get.mock.calls[4][0]).toEqual('/match/:id/invitations');
        expect(serverMocked.get.mock.calls[5][0]).toEqual('/player/:id/profile');
        expect(serverMocked.get.mock.calls[6][0]).toEqual('/player/:id/upcomingMatches');
        expect(serverMocked.get.mock.calls[7][0]).toEqual('/signUp/facebook/callback');
        expect(serverMocked.get.mock.calls[8][0]).toEqual('/signUp/google/callback');

        expect(serverMocked.post.mock.calls[0][0]).toEqual('/invitation/:id/accept');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/invitation/:id/reject');
        expect(serverMocked.post.mock.calls[2][0]).toEqual('/logIn/local');
        expect(serverMocked.post.mock.calls[3][0]).toEqual('/logIn/facebook');
        expect(serverMocked.post.mock.calls[4][0]).toEqual('/logIn/google');
        expect(serverMocked.post.mock.calls[5][0]).toEqual('/match/:id/addInvitation');
        expect(serverMocked.post.mock.calls[6][0]).toEqual('/match/:id/removeInvitation');
        expect(serverMocked.post.mock.calls[7][0]).toEqual('/player/create');
        expect(serverMocked.post.mock.calls[8][0]).toEqual('/player/:id/update');
        expect(serverMocked.post.mock.calls[9][0]).toEqual('/signUp/local');
        expect(serverMocked.post.mock.calls[10][0]).toEqual('/signUp/facebook');
        expect(serverMocked.post.mock.calls[11][0]).toEqual('/signUp/google');

        expect(serverMocked.delete.mock.calls[0][0]).toEqual('/invitation/:id');
        expect(serverMocked.delete.mock.calls[1][0]).toEqual('/match/:id');
        expect(serverMocked.delete.mock.calls[2][0]).toEqual('/player/:id');
    });
});