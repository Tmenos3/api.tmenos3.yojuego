import PlayerESRepository from '../../../src/repositories/PlayerESRepository';
import Player from '../../../src/models/Player';

describe('PlayerESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); }),
            update: jest.fn((document, callback) => { callback(err, ret) })
        }
    };

    pit('Can get a player', () => {
        var player = new Player('aValidNickname', new Date(2010, 10, 10), 'aValidState', 'adminState', '1');

        let client = getMockedClient(false, { _id: player.userid, source: player });

        let repo = new PlayerESRepository(client);
        return repo.get(player.userid)
            .then((resp) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('player');
                expect(client.get.mock.calls[0][0].id).toEqual(player.userid);
                
                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(player.userid);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a player', () => {
        var player = new Player('aValidNickname', new Date(2010, 10, 10), 'aValidState', 'adminState', '1');
        let client = getMockedClient(false, { _id: player.userid, _source: player });

        let repo = new PlayerESRepository(client);
        return repo.add(player)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('player');
                expect(client.index.mock.calls[0][0].body).toEqual(player);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(player.userid);
                expect(resp.message).toEqual(PlayerESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Cannot add a player if it is not instanceOf Player', () => {
        let notInstanceOfPlayer = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.add(notInstanceOfPlayer)
            .then((resp) => (err) => expect(true).toEqual(false),
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.INVALID_INSTANCE_PLAYER);
            });
    });

    pit('Cannot update a player if it is not instanceOf Player', () => {
        let notInstanceOfPlayer = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.update(notInstanceOfPlayer)
            .then((resp) => (err) => expect(true).toEqual(false),
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.INVALID_INSTANCE_PLAYER);
            });
    });

    pit('Can update a player', () => {
        var player = new Player('aValidNickname', new Date(2010, 10, 10), 'aValidState', 'adminState', '1');
        player._id = 'internalId';
        let client = getMockedClient(false, { _id: player._id, _source: player });

        let repo = new PlayerESRepository(client);
        return repo.update(player)
            .then((resp) => {
                expect(client.update.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.update.mock.calls[0][0].type).toEqual('player');
                expect(client.update.mock.calls[0][0].id).toEqual(player._id);
                expect(client.update.mock.calls[0][0].body.doc).not.toBeNull();
                expect(client.update.mock.calls[0][0].body.doc).not.toBeUndefined();

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(player._id);
                expect(resp.message).toEqual(PlayerESRepository.DOCUMENT_UPDATED);
            }, (err) => expect(true).toEqual(false));
    });
});
