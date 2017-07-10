import FacebookUser from '../../../src/models/FacebookUser';

describe('FacebookUser', () => {
    it('Can create a valid FacebookUser', () => {
        var anId = '1';
        var aFacebookUser = new FacebookUser(anId);

        expect(aFacebookUser.id).toBe(anId);
        expect(aFacebookUser.type).toBe(FacebookUser.TYPES.FACEBOOK);
    });
});