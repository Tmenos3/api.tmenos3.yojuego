import UserESRepository from '../../../src/repositories/UserESRepository';
import User from '../../../src/models/User';

describe('UserESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); })
        }
    };

    pit('Can get a user by id ', () => {
        var user = new User('userType');
        user.id = 'id';
        let client = getMockedClient(false, { _id: user.id, source: user });

        let repo = new UserESRepository(client);
        return repo.getById(user.id)
            .then((userReturned) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('user');
                expect(client.get.mock.calls[0][0].id).toEqual(user.id);
                expect(userReturned).toEqual(user);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can get list a users by criteria ', () => {
        var users = [
            { _id: 'anyValidId', _source: { userType: 'userType' } },
            { _id: 'otherValidId', _source: { userType: 'other_userType' } },
        ];
        var criteria = { criteria: 'anyCriteria' };
        let client = getMockedClient(false, { hits: { hits: users } });

        let repo = new UserESRepository(client);
        return repo.getBy(criteria)
            .then((usersReturned) => {
                expect(client.search.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.search.mock.calls[0][0].type).toEqual('user');
                expect(client.search.mock.calls[0][0].body.query.match).toEqual(criteria);
                expect(usersReturned.length).toEqual(users.length);
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a user', () => {
        var user = new User('type');
        let client = getMockedClient(false, {});

        let repo = new UserESRepository(client);
        return repo.add(user)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('user');
                expect(client.index.mock.calls[0][0].body.userType).toEqual(user.userType);
                expect(resp.message).toEqual(UserESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });
});