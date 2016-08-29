jest.unmock('../../../src/models/Friendship');
import Friendship from '../../../src/models/Friendship';

describe('Friendship', () => {
    it('Cannot create with an undefined sender', () => {
        var anUndefinedSender;

        expect(() => new Friendship(anUndefinedSender, 1)).toThrowError(Friendship.INVALID_SENDER());
    });

    it('Cannot create with a null sender', () => {
        var aNullSender = null;

        expect(() => new Friendship(aNullSender, 1)).toThrowError(Friendship.INVALID_SENDER());
    });

    it('Cannot create with an undefined recipient', () => {
        var anUndefinedRecipient;

        expect(() => new Friendship(1, anUndefinedRecipient)).toThrowError(Friendship.INVALID_RECIPIENT());
    });

    it('Cannot create with a null recipient', () => {
        var aNullRecipient = null;

        expect(() => new Friendship(1, aNullRecipient)).toThrowError(Friendship.INVALID_RECIPIENT());
    });

    it('Cannot create with a sender equal recipient', () => {
        expect(() => new Friendship(1, 1)).toThrowError(Friendship.INVALIDAD_FRIENDSHIP());
    });

    it('Can create a valid Friendship', () => {
        var aSender = 1;
        var aRecipient = 2;
        var aFriendship = new Friendship(aSender, aRecipient);
        expect(aFriendship.sender).toBe(aSender);
        expect(aFriendship.recipient).toBe(aRecipient);
    });
});