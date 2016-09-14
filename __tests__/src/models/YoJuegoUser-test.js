YoJuegoUser

import YoJuegoUser from '../../../src/models/YoJuegoUser';

describe('YoJuegoUser', () => {

    it('Cannot create with an undefined id', () => {
        var anUndefinedId;

        expect(() => new YoJuegoUser(anUndefinedId).toThrowError(YoJuegoUser.INVALID_ID()));
    });

    it('Cannot create with a null id', () => {
        var aNullId = null;

        expect(() => new YoJuegoUser('type', aNullId).toThrowError(YoJuegoUser.INVALID_ID()));
    });

    it('Cannot create with an undefined password', () => {
        var anUndefinedPassword;

        expect(() => new YoJuegoUser(1, anUndefinedPassword).toThrowError(YoJuegoUser.INVALID_PASSWORD()));
    });

    it('Cannot create with a null password', () => {
        var aNullPassword = null;

        expect(() => new YoJuegoUser(1, aNullPassword).toThrowError(YoJuegoUser.INVALID_PASSWORD()));
    });

    it('Can create a valid YoJuegoUser', () => {
        var anId = '1';
        var aPassword = 'password';
        var aYoJuegoUser = new YoJuegoUser(anId, aPassword);

        expect(aYoJuegoUser.id).toBe(anId);
        expect(aYoJuegoUser.type).toBe('yojuego');
        expect(aYoJuegoUser.password).toBe(aPassword);
    });
});