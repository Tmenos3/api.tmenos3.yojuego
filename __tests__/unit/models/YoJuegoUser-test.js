import YoJuegoUser from '../../../src/models/YoJuegoUser';

describe('YoJuegoUser', () => {

    it('Cannot create with a bad formatted mail as id', () => {
        expect(() => new YoJuegoUser('badFormattedEmail', 'pass')).toThrowError(YoJuegoUser.TYPES.INVALID_ID);
    });

    it('Cannot create with an undefined password', () => {
        let anUndefinedPassword;

        expect(() => new YoJuegoUser('mail@mail.com', anUndefinedPassword)).toThrowError(YoJuegoUser.TYPES.INVALID_PASSWORD);
    });

    it('Cannot create with a null password', () => {
        let aNullPassword = null;

        expect(() => new YoJuegoUser('mail@mail.com', aNullPassword)).toThrowError(YoJuegoUser.TYPES.INVALID_PASSWORD);
    });

    it('Cannot create with an empty password', () => {
        let emptyPass = '';

        expect(() => new YoJuegoUser('mail@mail.com', emptyPass)).toThrowError(YoJuegoUser.TYPES.INVALID_PASSWORD);
    });

    it('Can create a valid YoJuegoUser', () => {
        var anId = 'mail@mail.com';
        var aPassword = 'password';
        var aYoJuegoUser = new YoJuegoUser(anId, aPassword);

        expect(aYoJuegoUser.id).toBe(anId);
        expect(aYoJuegoUser.type).toBe(YoJuegoUser.TYPES.YOJUEGO);
        expect(aYoJuegoUser.password).toBe(aPassword);
    });
});