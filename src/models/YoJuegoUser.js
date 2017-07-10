let User = require('./User');
let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let ValidMailCondition = require('no-if-validator').ValidMailCondition;

class YoJuegoUser extends User {
    constructor(id, password, isLogged, token) {
        super(User.TYPES.YOJUEGO, id, isLogged, token);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(password).throw(new Error(YoJuegoUser.INVALID_PASSWORD)));
        validator.addCondition(new CustomCondition(() => { return password !== "" }).throw(new Error(YoJuegoUser.INVALID_PASSWORD)));
        validator.addCondition(new CustomCondition(() => { return password !== null && password != undefined && password.length > 5 }).throw(new Error(YoJuegoUser.PASSWORD_MUSTBE_LARGER)));
        validator.addCondition(new ValidMailCondition(id).throw(new Error(YoJuegoUser.INVALID_MAIL)));

        validator.execute(() => {
            this.password = password;
        }, (err) => { throw err; });
    }

    static get ERRORS() {
        return {
            INVALID_PASSWORD: 'La contraseña no puede ser nula o indefinida.',
            PASSWORD_MUSTBE_LARGER: 'La contraseña debe tener al menos 6 caracteres.',
            INVALID_MAIL: 'El mail no tiene un formato valido.'
        }
    }
}

module.exports = YoJuegoUser;