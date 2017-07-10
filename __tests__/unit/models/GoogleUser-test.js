import GoogleUser from '../../../src/models/GoogleUser';

describe('GoogleUser', () => {

    it('Can create a valid GoogleUser', () => {
        var anId = '1';
        var aGoogleUser = new GoogleUser(anId);

        expect(aGoogleUser.id).toEqual(anId);
        expect(aGoogleUser.type).toEqual(GoogleUser.TYPES.GOOGLE);
    });
});