let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let HasNotBlankSpacesCondition = require('no-if-validator').HasNotBlankSpacesCondition;

class User {
    constructor(type, id, isLogged, token) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(User.ERRORS.INVALID_TYPE)));
        validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(User.ERRORS.INVALID_ID)));
        validator.addCondition(new CustomCondition(() => { return type !== '' }).throw(new Error(User.ERRORS.INVALID_TYPE)));
        validator.addCondition(new CustomCondition(() => { return id !== '' }).throw(new Error(User.ERRORS.INVALID_ID)));
        validator.addCondition(new CustomCondition(() => { return User._isValidType(type); }).throw(new Error(User.ERRORS.INVALID_TYPE)));

        validator.execute(() => {
            this.type = type;
            this.id = id;
            this.isLogged = isLogged || false;
            this.token = token || null;
            this.auditInfo = null;
        }, (err) => { throw err; });
    }

    logIn(token) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(token).throw(new Error(User.ERRORS.INVALID_TOKEN)));
        validator.addCondition(new CustomCondition(() => { return token !== '' }).throw(new Error(User.ERRORS.INVALID_TOKEN)));

        validator.execute(() => {
            this.token = token;
            this.isLogged = true;
        }, (err) => { throw err; });
    }

    logOut() {
        this.token = null;
        this.isLogged = false;
    }

    isLoggedIn() {
        return this.isLogged === true;
    }

    static _isValidType(type) {
        return User.TYPES[type] !== null && User.TYPES[type] !== undefined;
    }

    static get ERRORS() {
        return {
            INVALID_TYPE: 'El tipo de usuario no puede ser nulo o indefinido o vacio.',
            INVALID_ID: 'El Id de usuario no puede ser nulo o indefinido o vacio.',
            INVALID_TOKEN: 'El token no puede ser null ni undefined ni vacio.'
        }
    }

    static get TYPES() {
        return {
            FACEBOOK: 'FACEBOOK',
            GOOGLE: 'GOOGLE',
            YOJUEGO: 'YOJUEGO'
        }
    }
}

module.exports = User;