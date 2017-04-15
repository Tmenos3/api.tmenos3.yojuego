let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let CustomCondition = require('no-if-validator').CustomCondition;

class User {
    constructor(userType, id, isLogged, token, oauthInfo) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(userType).throw(new Error(User.INVALID_USER)));
        validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(User.INVALID_ID)));
        validator.addCondition(new CustomCondition(() => { return userType != "" }).throw(new Error(User.INVALID_USER)));
        validator.addCondition(new CustomCondition(() => { return id != "" }).throw(new Error(User.INVALID_ID)));

        validator.execute(() => {
            this.type = userType;
            this.id = id;
            this.isLogged = isLogged || false;
            this.token = token;
            this.oauthInfo = oauthInfo;
        }, (err) => { throw err; });
    }

    static isValidMail(eMail) {
        return new ValidMailCondition(eMail).isValidMail();
    }

    static get INVALID_USER() {
        return 'El tipo de usuario no puede ser nulo o indefinido';
    }

    static get INVALID_ID() {
        return 'El Id de usuario no puede ser nulo o indefinido';
    }

    static get INVALID_EMAIL_FORMAT() {
        return 'El formato del email no es válido';
    }
}

module.exports = User;