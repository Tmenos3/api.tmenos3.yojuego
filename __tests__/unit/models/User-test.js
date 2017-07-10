import User from '../../../src/models/User';

describe('User', () => {
    it('Cannot create with an undefined userType', () => {
        let anUndefinedType;

        expect(() => new User(anUndefinedType, '1')).toThrowError(User.ERRORS.INVALID_TYPE);
    });

    it('Cannot create with a null userType', () => {
        let aNullType = null;

        expect(() => new User(aNullType, '1')).toThrowError(User.ERRORS.INVALID_TYPE);
    });

    it('Cannot create with an empty userType', () => {
        let emptyType = '';

        expect(() => new User(emptyType, '1')).toThrowError(User.ERRORS.INVALID_TYPE);
    });

    it('Cannot create with an undefined id', () => {
        let anUndefinedId;

        expect(() => new User(User.TYPES.YOJUEGO, anUndefinedId)).toThrowError(User.ERRORS.INVALID_ID);
    });

    it('Cannot create with a null id', () => {
        let aNullId = null;

        expect(() => new User(User.TYPES.YOJUEGO, aNullId)).toThrowError(User.ERRORS.INVALID_ID);
    });

    it('Cannot create with an empty id', () => {
        let emptyId = '';

        expect(() => new User(User.TYPES.YOJUEGO, emptyId)).toThrowError(User.ERRORS.INVALID_ID);
    });

    it('Cannot create with a not listed type', () => {
        expect(() => new User('anyType', '1')).toThrowError(User.ERRORS.INVALID_TYPE);
    });

    it('Can create a valid User', () => {
        let atype = User.TYPES.YOJUEGO;
        let anId = '1';
        let aUser = new User(atype, anId);
        expect(aUser.type).toEqual(atype);
        expect(aUser.id).toEqual(anId);
    });

    it('Cannot logIn a user with an undefined token', () => {
        let aUser = new User(User.TYPES.YOJUEGO, '1');
        expect(() => aUser.logIn(undefined)).toThrowError(User.ERRORS.INVALID_TOKEN);
    });

    it('Cannot logIn a user with a null token', () => {
        let aUser = new User(User.TYPES.YOJUEGO, '1');
        expect(() => aUser.logIn(null)).toThrowError(User.ERRORS.INVALID_TOKEN);
    });

    it('Cannot logIn a user with an empty token', () => {
        let aUser = new User(User.TYPES.YOJUEGO, '1');
        expect(() => aUser.logIn('')).toThrowError(User.ERRORS.INVALID_TOKEN);
    });

    it('Can logIn a user', () => {
        let aUser = new User(User.TYPES.YOJUEGO, '1');
        let token = 'someToken';
        aUser.logIn(token);
        expect(aUser.isLoggedIn()).toBeTruthy();
        expect(aUser.token).toBe(token);
    });

    it('Can logOut a user', () => {
        let aUser = new User(User.TYPES.YOJUEGO, '1');
        aUser.logIn('someToken');

        aUser.logOut();
        expect(aUser.isLoggedIn()).toBeFalsy();
        expect(aUser.token).toBeNull();
    });
});