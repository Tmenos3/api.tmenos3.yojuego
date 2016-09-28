import UserESRepository from '../../../src/repositories/UserESRepository';
import User from '../../../src/models/User';

describe('UserESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); }),
            update: jest.fn((criteria, callback) => { callback(err, ret); }),
            delete: jest.fn((criteria, callback) => { callback(err, ret); })
        }
    };

    pit('Can get a user', () => {
        var user = new User('userType', '1');
        let client = getMockedClient(false, { _id: user.id, source: user });

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
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can get a user by Id and Type ', () => {
        let user = new User('facebook', '1');
        let ret = { _id: user.id, _source: user }

        var criteria = { criteria: 'anyCriteria' };
        let client = getMockedClient(false, { hits: { hits: [ret] } });

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
            }, (err) => expect(true).toEqual(false));
    });

    pit('Can add a user', () => {
        var user = new User('type', '1');
        let client = getMockedClient(false, {_id: user.id, _source: user});

        let repo = new UserESRepository(client);
        return repo.add(user)
            .then((resp) => {
                expect(client.index.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.index.mock.calls[0][0].type).toEqual('user');
                expect(client.index.mock.calls[0][0].body).toEqual(user);

                expect(resp.code).toEqual(200);
                expect(resp.resp._id).toEqual(user.id);
                expect(resp.resp._source.id).toEqual(user.id);
                expect(resp.resp._source.type).toEqual(user.type);
                expect(resp.message).toEqual(UserESRepository.DOCUMENT_INSERTED);
            }, (err) => expect(true).toEqual(false));
    });
});