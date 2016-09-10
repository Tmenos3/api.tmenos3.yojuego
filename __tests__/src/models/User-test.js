import User from '../../../src/models/User';
import UserType from '../../../src/constants/UserType';

describe('User', () => {
    it('Cannot create with an undefined type', () => {
        var anUndefinedType;

        expect(() => new User(anUndefinedType).toThrowError(User.INVALID_USER()));
    });

    it('Cannot create with a null type', () => {
        var aNullType = null;

        expect(() => new User(aNullType).toThrowError(User.INVALID_USER()));
    });

    it('Cannot create with an undefined id', () => {
        var anUndefinedId;

        expect(() => new User('type', anUndefinedId).toThrowError(User.INVALID_ID()));
    });

    it('Cannot create with a null id', () => {
        var aNullId = null;

        expect(() => new User('type', aNullId).toThrowError(User.INVALID_ID()));
    });

    it('Can create a valid User', () => {
        var atype = UserType.yoJuego;
        var anId = 1;
        var aUser = new User(atype, anId);
        expect(aUser.type).toBe(atype);
        expect(aUser.id).toBe(anId);
    });
});