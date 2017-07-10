import UserESRepository from '../../../src/repositories/UserESRepository';
import User from '../../../src/models/User';
import getMockedClient from '../../__tools__/mockedESClient';

describe('UserESRepository', () => {
    it('Can get a user', () => {
        let user = new User(User.TYPES.FACEBOOK, '1');
        let client = getMockedClient(false, { _id: user.id, _source: user });

        let repo = new UserESRepository(client);
        return repo.get(user.id)
            .then((resp) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('user');
                expect(client.get.mock.calls[0][0].id).toEqual(user.id);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp.id).toEqual(user.id);
                expect(resp.resp.type).toEqual(user.type);
                expect(resp.resp._id).toEqual(user.id);
                expect(() => { return resp.resp instanceof User }).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can get a user by Id and Type ', () => {
        let user = new User(User.TYPES.FACEBOOK, '1');
        let client = getMockedClient(false, [{ _id: user.id, _source: user }]);

        let repo = new UserESRepository(client);
        return repo.getByIdAndType(user.id, user.type)
            .then((resp) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('user');
                expect(client.search.mock.calls[0][0].body.query.bool.filter[0].term.type).toEqual(user.type);
                expect(client.search.mock.calls[0][0].body.query.bool.filter[1].term.id).toEqual(user.id);

                expect(resp.code).toEqual(200);
                expect(resp.message).toBeNull();
                expect(resp.resp.id).toEqual(user.id);
                expect(resp.resp.type).toEqual(user.type);
                expect(resp.resp._id).toEqual(user.id);
                expect(() => { return resp.resp instanceof User }).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Cannot get a user by id and type if id is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.getByIdAndType(null, 'type')
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(UserESRepository.ERRORS.INVALID_ID);
            });
    });

    it('Cannot get a user by id and type if id is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.getByIdAndType(undefined, 'type')
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(UserESRepository.ERRORS.INVALID_ID);
            });
    });

    it('Cannot get a user by id and type if type is null', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.getByIdAndType('1', null)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(UserESRepository.ERRORS.INVALID_TYPE);
            });
    });

    it('Cannot get a user by id and type if type is undefined', () => {
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.getByIdAndType('1', undefined)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(UserESRepository.ERRORS.INVALID_TYPE);
            });
    });

    it('Can add a user', () => {
        let user = new User(User.TYPES.FACEBOOK, '1');
        let client = getMockedClient(false, { _id: user.id, _source: user });

        let repo = new UserESRepository(client);
        return repo.add(user)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('user');
                expect(client.index.mock.calls[0][0].body).toEqual(user);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(user.id);
                expect(resp.resp.id).toEqual(user.id);
                expect(resp.resp.type).toEqual(user.type);
                expect(resp.message).toEqual(UserESRepository.MESSAGES.DOCUMENT_INSERTED);
                expect(() => { return resp.resp instanceof User }).toBeTruthy();
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Cannot add a user if it is not instanceOf User', () => {
        let notInstanceOfUser = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.add(notInstanceOfUser)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(UserESRepository.ERRORS.INVALID_INSTANCE_USER);
            });
    });

    it('Cannot update a user if it is not instanceOf User', () => {
        let notInstanceOfUser = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.update(notInstanceOfUser)
            .then((resp) => { expect(true).toEqual(false) },
            (err) => {
                expect(err.code).toEqual(410);
                expect(err.message).toEqual(UserESRepository.ERRORS.INVALID_INSTANCE_USER);
            });
    });

    it('Cannot delete a user if it is not instanceOf User', () => {
        let notInstanceOfUser = {};
        let client = getMockedClient(false, { _id: 'id', _source: {} });

        let repo = new UserESRepository(client);
        return repo.delete(notInstanceOfUser)
            .then((resp) => { expect(true).toEqual(false) },
            (cause) => {
                expect(cause.code).toEqual(410);
                expect(cause.message).toEqual(UserESRepository.ERRORS.INVALID_INSTANCE_USER);
            })
            .catch((err) => { expect(true).toEqual(false); });
    });

    it('Can update a user', () => {
        let user = new User(User.TYPES.FACEBOOK, '1');
        user._id = 'internalId';
        let client = getMockedClient(false, { _id: user._id, _source: user });

        let repo = new UserESRepository(client);
        return repo.update(user)
            .then((resp) => {
                expect(client.update.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.update.mock.calls[0][0].type).toEqual('user');
                expect(client.update.mock.calls[0][0].id).toEqual(user._id);
                expect(client.update.mock.calls[0][0].body.doc).not.toBeNull();
                expect(client.update.mock.calls[0][0].body.doc).not.toBeUndefined();

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(user._id);
                expect(resp.message).toEqual(UserESRepository.MESSAGES.DOCUMENT_UPDATED);
            }, (err) => { expect(true).toEqual(false) });
    });

    it('Can delete a user', () => {
        let user = new User(User.TYPES.FACEBOOK, '1');
        user._id = 'internalId';
        let client = getMockedClient(false, { _id: user._id, _source: user });

        let repo = new UserESRepository(client);
        return repo.delete(user)
            .then((resp) => {
                expect(client.delete.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.delete.mock.calls[0][0].type).toEqual('user');
                expect(client.delete.mock.calls[0][0].id).toEqual(user._id);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(user._id);
                expect(resp.message).toEqual(UserESRepository.MESSAGES.DOCUMENT_DELETED);
            }, (err) => { expect(true).toEqual(false) });
    });
});