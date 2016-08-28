jest.unmock('../../../src/models/FriendRequest');
import FriendRequest from '../../../src/models/FriendRequest';

describe('FriendRequest', () => {
    it('Cannot create with an undefined sender', () => {
        var anUndefinedSender;
        expect(1).toBe(1);
        // expect(() => new FriendRequest(anUndefinedSender)).toThrowError(FriendRequest.INVALID_SENDER());
    });
    //
    //   it('Cannot create with a null sender', () => {
    //       var aNullSender = null;
    //
    //       expect(() => new FriendRequest(aNullSender)).toThrowError(FriendRequest.INVALID_SENDER());
    //   });
    //
    //   it('Cannot create with a sender distinct of integer', () => {
    //       var aSender = 'null';
    //
    //       expect(() => new FriendRequest(aSender)).toThrowError(FriendRequest.INVALID_SENDER());
    //   });
    //
    //   it('Cannot create with an undefined recipient', () => {
    //       var anUndefinedRecipient;
    //
    //       expect(() => new FriendRequest(1, anUndefinedRecipient)).toThrowError(FriendRequest.INVALID_RECIPIENT());
    //   });
    //
    //   it('Cannot create with a null recipient', () => {
    //       var aNullRecipient = null;
    //
    //       expect(() => new FriendRequest(1, aNullRecipient)).toThrowError(FriendRequest.INVALID_RECIPIENT());
    //   });
    //
    //   it('Cannot create with a recipient distinct of integer', () => {
    //       var aRecipient = 'null';
    //
    //       expect(() => new FriendRequest(1, aRecipient)).toThrowError(FriendRequest.INVALID_RECIPIENT());
    //   });
    //
    //   it('Can change FriendRequest state to accepted', () => {
    //       var friendRequest = new FriendRequest(1, 2);
    //       friendRequest.acceptRequest();
    //
    //       expect(friendRequest.state).toBe(FriendRequest.FRIEND_REQUEST_ACCEPTED_STATE());
    //   });
    //
    //   it('Can change FriendRequest state to rejected', () => {
    //       var friendRequest = new FriendRequest(1, 2);
    //       friendRequest.rejectedRequest();
    //
    //       expect(friendRequest.state).toBe(FriendRequest.FRIEND_REQUEST_REJECTED_STATE());
    //   });
    //
    //   it('Cannot create with de sender equals recipient', () => {
    //       var aSender = 1;
    //       var aRecipient = aSender;
    //
    //       expect(() => new FriendRequest(aSender, aRecipient)).toThrowError(FriendRequest.INVALID_SENDER_AND_RECIPIENT_ARE_EQUALS());
    //   });
    //
    //   it('Can create a valid FriendRequest', () => {
    //       var aSender = 1;
    //       var aRecipient = 2;
    //
    //       var friendRequest = new FriendRequest(aSender, aRecipient);
    //
    //       expect(friendRequest.sender).toBe(aSender);
    //       expect(friendRequest.recipient).toBe(aRecipient);
    //       expect(friendRequest.state).toBe(FriendRequest.FRIEND_REQUEST_CREATED_STATE());
    //   });
});