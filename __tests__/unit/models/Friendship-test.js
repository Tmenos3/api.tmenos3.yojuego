import Friendship from '../../../src/models/Friendship';

describe('Friendship', () => {
    it('Cannot create with an undefined player', () => {
        var anUndefinedPlayer;

        expect(() => new Friendship(anUndefinedPlayer, 1, 'STATUS', 'mail@mail.com')).toThrowError(Friendship.INVALID_PLAYER);
    });

    it('Cannot create with a null player', () => {
        var aNullPlayer = null;

        expect(() => new Friendship(aNullPlayer, 1, 'STATUS', 'mail@mail.com')).toThrowError(Friendship.INVALID_PLAYER);
    });

    it('Cannot create with an undefined friend', () => {
        var anUndefinedFriend;

        expect(() => new Friendship(1, anUndefinedFriend, 'STATUS', 'mail@mail.com')).toThrowError(Friendship.INVALID_FRIEND);
    });

    it('Cannot create with a null friend', () => {
        var aNullFriend = null;

        expect(() => new Friendship(1, aNullFriend, 'STATUS', 'mail@mail.com')).toThrowError(Friendship.INVALID_FRIEND);
    });

    it('Cannot create with an undefined status', () => {
        var anUndefinedStatus;

        expect(() => new Friendship(1, 2, anUndefinedStatus, 'mail@mail.com')).toThrowError(Friendship.INVALID_STATUS);
    });

    it('Cannot create with a null status', () => {
        var aNullStatus = null;

        expect(() => new Friendship(1, 2, aNullStatus, 'mail@mail.com')).toThrowError(Friendship.INVALID_STATUS);
    });

    it('Cannot create with an undefined mail', () => {
        var anUndefinedmail;

        expect(() => new Friendship(1, 2, 'STATUS', anUndefinedmail)).toThrowError(Friendship.INVALID_MAIL);
    });

    it('Cannot create with a null mail', () => {
        var aNullMail = null;

        expect(() => new Friendship(1, 2, 'STATUS', aNullMail)).toThrowError(Friendship.INVALID_MAIL);
    });

    it('Cannot create with a player equal to friend', () => {
        expect(() => new Friendship(1, 1, 'STATUS', 'mail@mail.com')).toThrowError(Friendship.INCONSISTENT_PLAYER_FRIEND);
    });

    it('Can create a valid Friendship', () => {
        let aPlayer = 1;
        let aFriend = 2;
        let aStatus = 'STATUS';
        let aMail = 'mail@mail.com';
        let aFriendship = new Friendship(aPlayer, aFriend, aStatus, aMail);
        expect(aFriendship.playerId).toBe(aPlayer);
        expect(aFriendship.friendId).toBe(aFriend);
        expect(aFriendship.status).toBe(aStatus);
        expect(aFriendship.email).toBe(aMail);
    });
});