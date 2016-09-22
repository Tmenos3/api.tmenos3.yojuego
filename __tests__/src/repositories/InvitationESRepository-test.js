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
        let invitation = new Invitation('aSender', 'aRecipient', 'aMatch');

        let client = getMockedClient(false, { _id: '1', source: invitation });

        let repo = new InvitationESRepository(client);
        return repo.getById(invitation._id)
            .them((invitationReturned) => {
                expect(client.get.mock.calls[0][0].index).toEqual('yojuego');
                expect(client.get.mock.calls[0][0].type).toEqual('invitation');
                expect(client.get.mock.calls[0][0].id).toEqual('1');
                expect(invitationReturned).toEqual(invitation);
            }, (err) => expect(true).toEqual(false));
    });
});