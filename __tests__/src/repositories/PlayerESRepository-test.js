import PlayerESRepository from '../../../src/repositories/PlayerESRepository';
import Player from '../../../src/models/Player';

describe('PlayerESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); })
        }
    };

    pit('Can get a player by id ', () => {
        var player = new Player('playerID', 'aValidNickname', new Date(2010, 10, 10), 'aValidState');
        let client = getMockedClient(false, { hits: { hits: [player] } });

        let repo = new PlayerESRepository(client);
        return repo.getById(player.id)
            .then((playerReturned) => {
                expect(client.search.mock.calls[0][0].index).toEqual('app');
                expect(client.search.mock.calls[0][0].type).toEqual('player');
                expect(client.search.mock.calls[0][0].body.query.match._id).toEqual(player.id);
                expect(playerReturned).toEqual(player);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can get list a players by criteria ', () => {
        var players = [
            {_id: 'anyValidId', source: {nickName: 'nickName', birthDate: '2016-09-03T19:00:00Z', state: 'developing...'}},
            {_id: 'otherValidId', source: {nickName: 'other_nickName', birthDate: '2016-09-03T19:00:00Z', state: 'developing...'}},
            ];
        var criteria = {criteria: 'anyCriteria'};
        let client = getMockedClient(false, { hits: { hits: players } });

        let repo = new PlayerESRepository(client);
        return repo.getBy(criteria)
            .then((playersReturned) => {
                expect(client.search.mock.calls[0][0].index).toEqual('app');
                expect(client.search.mock.calls[0][0].type).toEqual('player');
                expect(client.search.mock.calls[0][0].body.query.match).toEqual(criteria);
                expect(playersReturned.length).toEqual(players.length);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a player', () => {
        var player = new Player('playerID', 'aValidNickname', new Date(2010, 10, 10), 'aValidState');
        let client = getMockedClient(false, {});

        let repo = new PlayerESRepository(client);
        return repo.add(player)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('app');
                expect(client.index.mock.calls[0][0].type).toEqual('player');
                expect(client.index.mock.calls[0][0].body.nickName).toEqual(player.nickName);
                expect(client.index.mock.calls[0][0].body.birthDate).toEqual(player.birthDate);
                expect(client.index.mock.calls[0][0].body.state).toEqual(player.state);
                expect(resp).toEqual(PlayerESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });
});
