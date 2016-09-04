import PlayerRoutes from '../../../src/routes/PlayerRoutes';

describe('PlayerRoutes', () => {
    it('Cannot add routes with an undefined server', () => {
        let undefinedServer;
        let playerRoutes = new PlayerRoutes();

        expect(() => playerRoutes.add(undefinedServer)).toThrowError(PlayerRoutes.INVALID_SERVER);
    });

    it('Cannot add routes with an null server', () => {
        let nullServer;
        let playerRoutes = new PlayerRoutes();

        expect(() => playerRoutes.add(nullServer)).toThrowError(PlayerRoutes.INVALID_SERVER);
    });

    it('Can add all routes', () => {
        let serverMocked = {
            get: jest.fn((url, callback) => { }),
            post: jest.fn((url, callback) => { }),
            delete: jest.fn((url, callback) => { })
        };
        let playerRoutes = new PlayerRoutes();
        playerRoutes.add(serverMocked)
        //GET: player
        //GET: player/getBy/:params
        //GET: player/:id
        //POST: player/create
        //POST: player/:id/update
        //DELETE: player/:id
        expect(serverMocked.get.mock.calls.length).toEqual(3);
        expect(serverMocked.post.mock.calls.length).toEqual(2);
        expect(serverMocked.delete.mock.calls.length).toEqual(1);
        expect(serverMocked.get.mock.calls[0][0]).toEqual('/player');
        expect(serverMocked.get.mock.calls[1][0]).toEqual('/player/getBy/:params');
        expect(serverMocked.get.mock.calls[2][0]).toEqual('/player/:id');
        expect(serverMocked.post.mock.calls[0][0]).toEqual('/player/create');
        expect(serverMocked.post.mock.calls[1][0]).toEqual('/player/:id/update');
        expect(serverMocked.delete.mock.calls[0][0]).toEqual('/player/:id');
    });
});