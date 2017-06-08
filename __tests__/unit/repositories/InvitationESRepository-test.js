import InvitationESRepository from '../../../src/repositories/InvitationESRepository';
import Invitation from '../../../src/models/Invitation';

describe('InvitationESRepository', () => {
    let getMockedClient = (err, ret) => {
        return {
            get: jest.fn((criteria, callback) => { callback(err, ret); }),
            search: jest.fn((criteria, callback) => { callback(err, ret); }),
            index: jest.fn((criteria, callback) => { callback(err, ret); })
        }
    };

    pit('Can get Invitation by id', () => {
        let invitation = new Invitation('aSender', 'aRecipient', 'aMatch', new Date(2010, 10, 10));
        invitation._id = 'id';

        let client = getMockedClient(false, { _id: invitation._id, source: invitation });

        let repo = new InvitationESRepository(client);
        return repo.get(invitation._id)
            .then((ret) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('invitation');
                expect(client.get.mock.calls[0][0].id).toEqual(invitation._id);

                expect(ret.code).toEqual(200);
                expect(ret.message).toBeNull();
                expect(ret.resp).toEqual(invitation);
            }, (err) => expect(true).toEqual(false));
    });
});