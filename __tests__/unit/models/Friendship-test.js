import Friendship from '../../../src/models/Friendship';

describe('Friendship', () => {
    it('Cannot create with an undefined player', () => {
        let anUndefinedPlayer;
        expect(() => new Friendship(anUndefinedPlayer, 1, Friendship.STATUS.CREATED, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INVALID_PLAYER);
    });

    it('Cannot create with a null player', () => {
        let aNullPlayer = null;
        expect(() => new Friendship(aNullPlayer, 1, Friendship.STATUS.CREATED, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INVALID_PLAYER);
    });

    it('Cannot create with an undefined friend', () => {
        let anUndefinedFriend;
        expect(() => new Friendship(1, anUndefinedFriend, Friendship.STATUS.CREATED, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INVALID_FRIEND);
    });

    it('Cannot create with a null friend', () => {
        let aNullFriend = null;
        expect(() => new Friendship(1, aNullFriend, Friendship.STATUS.CREATED, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INVALID_FRIEND);
    });

    it('Cannot create with an undefined status', () => {
        let anUndefinedStatus;
        expect(() => new Friendship(1, 2, anUndefinedStatus, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INVALID_STATUS);
    });

    it('Cannot create with a null status', () => {
        let aNullStatus = null;
        expect(() => new Friendship(1, 2, aNullStatus, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INVALID_STATUS);
    });

    it('Cannot create with an undefined mail', () => {
        let anUndefinedmail;
        expect(() => new Friendship(1, 2, Friendship.STATUS.CREATED, anUndefinedmail)).toThrowError(Friendship.ERRORS.INVALID_MAIL);
    });

    it('Cannot create with a null mail', () => {
        let aNullMail = null;
        expect(() => new Friendship(1, 2, Friendship.STATUS.CREATED, aNullMail)).toThrowError(Friendship.ERRORS.INVALID_MAIL);
    });

    it('Cannot create with a player equal to friend', () => {
        expect(() => new Friendship(1, 1, Friendship.STATUS.CREATED, 'mail@mail.com')).toThrowError(Friendship.ERRORS.INCONSISTENT_PLAYER_FRIEND);
    });

    it('Cannot create with a status not listed in Friendship.STATUS', () => {
        expect(() => new Friendship(1, 2, 'ANY STATUS', 'mail@mail.com')).toThrowError(Friendship.ERRORS.STATUS_NOT_ALLOWED);
    });

    it('Friendship is accepted if status is equal to ACCEPTED', () => {
        let acceptedFriendship = new Friendship(1, 2, Friendship.STATUS.ACCEPTED, 'valid@mail.com');
        let notAcceptedFriendship = new Friendship(1, 2, Friendship.STATUS.CREATED, 'valid@mail.com');
        expect(acceptedFriendship.isAccepted()).toBe(true);
        expect(notAcceptedFriendship.isAccepted()).toBe(false);
    });

    it('Friendship is rejected if status is equal to REJECTED', () => {
        let rejectedFriendship = new Friendship(1, 2, Friendship.STATUS.REJECTED, 'valid@mail.com');
        let notRejectedFriendship = new Friendship(1, 2, Friendship.STATUS.CREATED, 'valid@mail.com');
        expect(rejectedFriendship.isRejected()).toBe(true);
        expect(notRejectedFriendship.isRejected()).toBe(false);
    });

    it('Friendship is deleted if status is equal to DELETED', () => {
        let deletedFriendship = new Friendship(1, 2, Friendship.STATUS.DELETED, 'valid@mail.com');
        let notDeletedFriendship = new Friendship(1, 2, Friendship.STATUS.CREATED, 'valid@mail.com');
        expect(deletedFriendship.isDeleted()).toBe(true);
        expect(notDeletedFriendship.isDeleted()).toBe(false);
    });

    it('Accept changes status to ACCEPTED', () => {
        let friendship = new Friendship(1, 2, Friendship.STATUS.CREATED, 'valid@mail.com');
        expect(friendship.isAccepted()).toBe(false);

        friendship.accept();
        expect(friendship.isAccepted()).toBe(true);
    });

    it('Reject changes status to REJECTED', () => {
        let friendship = new Friendship(1, 2, Friendship.STATUS.CREATED, 'valid@mail.com');
        expect(friendship.isRejected()).toBe(false);

        friendship.reject();
        expect(friendship.isRejected()).toBe(true);
    });

    it('Delete changes status to DELETED', () => {
        let friendship = new Friendship(1, 2, Friendship.STATUS.CREATED, 'valid@mail.com');
        expect(friendship.isDeleted()).toBe(false);

        friendship.delete();
        expect(friendship.isDeleted()).toBe(true);
    });

    it('Can create a valid Friendship', () => {
        let aPlayer = 1;
        let aFriend = 2;
        let aStatus = Friendship.STATUS.CREATED;
        let aMail = 'mail@mail.com';
        let aFriendship = new Friendship(aPlayer, aFriend, aStatus, aMail);
        expect(aFriendship.playerId).toBe(aPlayer);
        expect(aFriendship.friendId).toBe(aFriend);
        expect(aFriendship.status).toBe(aStatus);
        expect(aFriendship.email).toBe(aMail);
    });
});