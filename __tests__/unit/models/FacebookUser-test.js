import FacebookUser from '../../../src/models/FacebookUser';

describe('FacebookUser', () => {

    it('Cannot create with an undefined id', () => {
        var anUndefinedId;

        expect(() => new FacebookUser(anUndefinedId).toThrowError(FacebookUser.INVALID_ID()));
    });

    it('Cannot create with a null id', () => {
        var aNullId = null;

        expect(() => new FacebookUser('type', aNullId).toThrowError(FacebookUser.INVALID_ID()));
    });

    it('Can create a valid FacebookUser', () => {
        var anId = 1;
        var aFacebookUser = new FacebookUser(anId);

        expect(aFacebookUser.id).toBe(anId);
        expect(aFacebookUser.type).toBe('facebook');
    });
});