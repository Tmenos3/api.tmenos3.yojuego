jest.unmock('../../../src/models/Friendship');
import Friendship from '../../../src/models/Friendship';

describe('Friendship', () => {
    it('Cannot create with an undefined user', () => {
        var anUndefinedUser;
        expect(() => new Friendship(anUndefinedUser, 1)).toThrowError(Friendship.INVALID_USER());
    });

    it('Cannot create with a null user', () => {
        var aNullUser = null;
        expect(() => new Friendship(aNullUser, 1)).toThrowError(Friendship.INVALID_USER());
    });

    it('Cannot create with a user distinct of int', () => {
        var anUser = '1';
        expect(() => new Friendship(anUser, 1)).toThrowError(Friendship.INVALID_USER());
    });

    it('Cannot create a relationship with an undefined Friend', () => {
        var anUndefidedFriend;
        expect(() => new Friendship(1, anUndefidedFriend)).toThrowError(Friendship.INVALIDAD_FRIEND());
    });

    it('Cannot create with an null Friend', () => {
        var anNullFriend;
        expect(() => new Friendship(1, anNullFriend)).toThrowError(Friendship.INVALIDAD_FRIEND());
    });

    it('Cannot create with a Friend distinct of integer', () => {
        var anUndefidedFriend = '1';
        expect(() => new Friendship(1, anUndefidedFriend)).toThrowError(Friendship.INVALIDAD_FRIEND());
    });

    it('Cannot create with a friend of mine', () => {

    });

    it('Can create a valid Friend', () => {
        var anUser = 1;
        var aNewFriend = 1;
        var aFriendship = new Friendship(anUser, aNewFriend);
        expect(aFriendship.user).toBe(anUser);
        expect(aFriendship.friend).toBe(aNewFriend);
    });
});