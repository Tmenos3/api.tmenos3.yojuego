import PlayerESRepository from '../../../src/repositories/PlayerESRepository';
import Player from '../../../src/models/Player';
import getMockedClient from '../../__tools__/mockedESClient';

describe('PlayerESRepository', () => {
    it('Can get a player', () => {
        let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');

        let client = getMockedClient(false, { _id: player.userid, _source: player });

        let repo = new PlayerESRepository(client);
        return repo.get(player.userid)
            .then((resp) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('player');
                expect(client.get.mock.calls[0][0].id).toEqual(player.userid);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(player.userid);
                expect(() => { return resp.resp instanceof Player }).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can add a player', () => {
        let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
        let client = getMockedClient(false, { _id: player.userid, _source: player });

        let repo = new PlayerESRepository(client);
        return repo.add(player)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('player');
                expect(client.index.mock.calls[0][0].body).toEqual(player);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(player.userid);
                expect(resp.message).toEqual(PlayerESRepository.MESSAGES.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });

    it('Cannot add a player if it is not instanceOf Player', () => {
        let notInstanceOfPlayer = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.add(notInstanceOfPlayer)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.ERRORS.INVALID_INSTANCE_PLAYER);
            });
    });

    it('Cannot update a player if it is not instanceOf Player', () => {
        let notInstanceOfPlayer = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.update(notInstanceOfPlayer)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.ERRORS.INVALID_INSTANCE_PLAYER);
            });
    });

    it('Cannot delete a player if it is not instanceOf Player', () => {
        let notInstanceOfPlayer = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.delete(notInstanceOfPlayer)
            .then((resp) => { expect(true).toEqual(false) },
            (cause) => {
                expect(cause.code).toEqual(410);
                expect(cause.message).toEqual(PlayerESRepository.ERRORS.INVALID_INSTANCE_PLAYER);
            })
            .catch((err) => { expect(true).toEqual(false); });
    });

    it('Can update a player', () => {
        let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
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
                expect(resp.message).toEqual(PlayerESRepository.MESSAGES.DOCUMENT_UPDATED);
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can delete a player', () => {
        let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');
        player._id = 'internalId';
        let client = getMockedClient(false, { _id: player._id, _source: player });

        let repo = new PlayerESRepository(client);
        return repo.delete(player)
            .then((resp) => {
                expect(client.delete.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.delete.mock.calls[0][0].type).toEqual('player');
                expect(client.delete.mock.calls[0][0].id).toEqual(player._id);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(player._id);
                expect(resp.message).toEqual(PlayerESRepository.MESSAGES.DOCUMENT_DELETED);
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can get a player by userid ', () => {
        let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');

        let client = getMockedClient(false, [{ _id: player.userid, _source: player }]);

        let repo = new PlayerESRepository(client);
        return repo.getByUserId(player.userid)
            .then((resp) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('player');
                expect(client.search.mock.calls[0][0].body.query.bool.filter[0].term.userid).toEqual(player.userid);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(player.userid);
                expect(() => { return resp.resp instanceof Player }).toBeTruthy();
            }, (err) => { expect(true).toEqual(false); });
    });

    it('Can get a player by email ', () => {
        let player = new Player('firstName', 'lastName', 'nickName', 'userId', 'mail@mail.com');

        let client = getMockedClient(false, [{ _id: player.userid, _source: player }]);

        let repo = new PlayerESRepository(client);
        return repo.getByEmail(player.email)
            .then((resp) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('player');
                expect(client.search.mock.calls[0][0].body.query.bool.filter[0].term.email).toEqual(player.email);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(player.userid);
                expect(() => { return resp.resp instanceof Player }).toBeTruthy();
            }, (err) => { expect(true).toEqual(false); });
    });

    it('Cannot get a player by userid if it is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.getByUserId(null)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.ERRORS.INVALID_USERID);
            });
    });

    it('Cannot get a player by userid if it is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.getByUserId(undefined)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.ERRORS.INVALID_USERID);
            });
    });

    it('Cannot get a player by email if it is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.getByEmail(null)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.ERRORS.INVALID_EMAIL);
            });
    });

    it('Cannot get a player by email if it is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new PlayerESRepository(client);
        return repo.getByEmail(undefined)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(PlayerESRepository.ERRORS.INVALID_EMAIL);
            });
    });
});
