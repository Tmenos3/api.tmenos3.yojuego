import InvitationRoutes from '../../../src/routes/InvitationRoutes';

describe('InvitationRoutes', () => {
    it('Can add all routes', () => {
        let serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { }),
            del: jest.fn((url, callback) => { })
        };
        let invitationRoutes = new InvitationRoutes();
        invitationRoutes.add(serverMocked)

        expect(serverMocked.get.mock.calls.length).toEqual(1);
        expect(serverMocked.post.mock.calls.length).toEqual(2);
        expect(serverMocked.del.mock.calls.length).toEqual(1);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/invitation/:id');
        expect(serverMocked.post.mock.calls[0][0]).toEqual('/invitation/:id/accept');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/invitation/:id/reject');
        expect(serverMocked.del.mock.calls[0][0]).toEqual('/invitation/:id');
    });
});