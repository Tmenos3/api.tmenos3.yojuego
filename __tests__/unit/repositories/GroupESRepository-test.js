import GroupESRepository from '../../../src/repositories/GroupESRepository';
import Group from '../../../src/models/Group';
import getMockedClient from '../../__tools__/mockedESClient';

describe('GroupESRepository', () => {
    let getGroup = () => {
        let group = new Group(['admin', 'noAdmin'], ['admin'], 'a group');
        group._id = 'id';
        return group;
    }

    it('Can get a Group', () => {
        let group = getGroup();
        let client = getMockedClient(false, { _id: group._id, _source: group });
        let repo = new GroupESRepository(client);

        return repo.get(group._id)
            .then((resp) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('group');
                expect(client.get.mock.calls[0][0].id).toEqual(group._id);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp._id).toEqual(group._id);
                expect(resp.resp instanceof Group).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can add a group', () => {
        let group = getGroup();
        let client = getMockedClient(false, { _id: group._id, _source: group });
        let repo = new GroupESRepository(client);

        return repo.add(group)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('group');
                expect(client.index.mock.calls[0][0].body).toEqual(group);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(group._id);
                expect(resp.message).toEqual(GroupESRepository.MESSAGES.DOCUMENT_INSERTED);
                expect(resp.resp instanceof Group).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Cannot add a group if it is not instanceOf Group', () => {
        let notInstanceOfGroup = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new GroupESRepository(client);
        return repo.add(notInstanceOfGroup)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(GroupESRepository.ERRORS.INVALID_INSTANCE_GROUP);
            });
    });

    it('Cannot update a group if it is not instanceOf Group', () => {
        let notInstanceOfGroup = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new GroupESRepository(client);
        return repo.update(notInstanceOfGroup)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(GroupESRepository.ERRORS.INVALID_INSTANCE_GROUP);
            });
    });

    it('Cannot delete a group if it is not instanceOf Group', () => {
        let notInstanceOfGroup = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new GroupESRepository(client);
        return repo.delete(notInstanceOfGroup)
            .then((resp) => (err) => expect(true).toEqual(false),
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(GroupESRepository.ERRORS.INVALID_INSTANCE_GROUP);
            });
    });

    it('Can update a group', () => {
        let group = getGroup();
        let client = getMockedClient(false, { _id: group._id, _source: group });
        let repo = new GroupESRepository(client);

        return repo.update(group)
            .then((resp) => {
                expect(client.update.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.update.mock.calls[0][0].type).toEqual('group');
                expect(client.update.mock.calls[0][0].id).toEqual(group._id);
                expect(client.update.mock.calls[0][0].body.doc).not.toBeNull();
                expect(client.update.mock.calls[0][0].body.doc).not.toBeUndefined();

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(group._id);
                expect(resp.message).toEqual(GroupESRepository.MESSAGES.DOCUMENT_UPDATED);
                expect(resp.resp instanceof Group).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can delete a group', () => {
        let group = getGroup();
        let client = getMockedClient(false, { _id: group._id, _source: group });
        let repo = new GroupESRepository(client);

        return repo.delete(group)
            .then((resp) => {
                expect(client.delete.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.delete.mock.calls[0][0].type).toEqual('group');
                expect(client.delete.mock.calls[0][0].id).toEqual(group._id);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(group._id);
                expect(resp.message).toEqual(GroupESRepository.MESSAGES.DOCUMENT_DELETED);
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Cannot get a groups by playerid if playerid is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new GroupESRepository(client);
        return repo.getByPlayerId(null)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(GroupESRepository.ERRORS.INVALID_PLAYERID);
            });
    });

    it('Cannot get a groups by playerid if playerid is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new GroupESRepository(client);
        return repo.getByPlayerId(undefined)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(GroupESRepository.ERRORS.INVALID_PLAYERID);
            });
    });

    it('Can get groups by playerid', () => {
        let group = getGroup();
        let result = [{ _id: group._id, _source: group }];
        let client = getMockedClient(false, result);
        let playerId = 'playerId';
        let date = new Date();

        let repo = new GroupESRepository(client);
        return repo.getByPlayerId(playerId)
            .then((resp) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('group');
                expect(client.search.mock.calls[0][0].body.query.bool.should[0].term.players.value).toEqual(playerId);
                expect(client.search.mock.calls[0][0].body.query.bool.should[1].term.admins.value).toEqual(playerId);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp).toHaveLength(result.length);
            }, (err) => { expect(true).toEqual(false) });
    });
});
