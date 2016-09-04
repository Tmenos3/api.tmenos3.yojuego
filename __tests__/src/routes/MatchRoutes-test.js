import MatchRoutes from '../../../src/routes/MatchRoutes';

describe('MatchRoutes', () => {
    it('Can add all routes', () => {
        let serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { }),
            delete: jest.fn((url, callback) => { })
        };
        let matchRoutes = new MatchRoutes();
        matchRoutes.add(serverMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(2);
        expect(serverMocked.post.mock.calls.length).toEqual(2);
        expect(serverMocked.delete.mock.calls.length).toEqual(1);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/match/:id');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/match/:id/invitations');
        expect(serverMocked.post.mock.calls[0][0]).toEqual('/match/:id/addInvitation');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/match/:id/removeInvitation');
        expect(serverMocked.delete.mock.calls[0][0]).toEqual('/match/:id');
    });
});