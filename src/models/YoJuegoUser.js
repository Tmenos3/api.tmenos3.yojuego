let UserType = require('../constants/UserType');
let User = require('./User');
let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let ValidMailCondition = require('no-if-validator').ValidMailCondition;

class YoJuegoUser extends User {
    constructor(id, password) {
        super(UserType.yoJuego, id);

        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(password).throw(new Error(YoJuegoUser.INVALID_PASSWORD)));
        validator.addCondition(new CustomCondition(() => { return password != "" }).throw(new Error(YoJuegoUser.INVALID_PASSWORD)));
        validator.addCondition(new CustomCondition(() => { return password != null && password != undefined && password.length > 5 }).throw(new Error(YoJuegoUser.PASSWORD_MUSTBE_LARGER)));
        validator.addCondition(new ValidMailCondition(id).throw(new Error(YoJuegoUser.INVALID_MAIL)));

        validator.execute(() => {
            this.password = password;
        }, (err) => { throw err; });
    }

    static get INVALID_PASSWORD() {
        return 'La contraseña no puede ser nula o indefinida';
    }

    static get PASSWORD_MUSTBE_LARGER(){
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    static get INVALID_MAIL() {
        return 'El mail no tiene un formato valido';
    }
}

module.exports = YoJuegoUser;