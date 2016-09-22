import PlayerESRepository from '../../../src/repositories/PlayerESRepository';
import Player from '../../../src/models/Player';

describe('PlayerESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); })
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
                expect(resp.code).toEqual(0);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(player.userid);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a player', () => {
        var player = new Player('aValidNickname', new Date(2010, 10, 10), 'aValidState', 'adminState', '1');
        let client = getMockedClient(false, {_id: player.userid, _source: player});

        let repo = new PlayerESRepository(client);
        return repo.add(player)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('player');
                expect(client.index.mock.calls[0][0].body.query).toEqual(player);

                expect(resp.code).toEqual(0);
                expect(resp.resp._id).toEqual(player.userid);
                expect(resp.message).toEqual(PlayerESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });
});
