import GoogleUser from '../../../src/models/GoogleUser';

describe('GoogleUser', () => {

    it('Cannot create with an undefined id', () => {
        var anUndefinedId;

        expect(() => new GoogleUser(anUndefinedId).toThrowError(GoogleUser.INVALID_ID()));
    });

    it('Cannot create with a null id', () => {
        var aNullId = null;

        expect(() => new GoogleUser('type', aNullId).toThrowError(GoogleUser.INVALID_ID()));
    });

    it('Can create a valid GoogleUser', () => {
        var anId = 1;
        var aGoogleUser = new GoogleUser(anId);

        expect(aGoogleUser.userid).toBe(anId);
    });
});