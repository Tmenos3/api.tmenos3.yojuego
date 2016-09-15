'use strict'
var UserType = require('../constants/UserType');
var User = require('./User');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class YoJuegoUser extends User {
    constructor(id, password) {
        super(UserType.yoJuego, id);

        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(password).throw(new Error(YoJuegoUser.INVALID_PASSWORD)));

        validator.execute(() => {
            this.password = password;
        }, (err) => { throw err; });
    }
    static get INVALID_PASSWORD() {
        return 'La contraseña no puede ser nula o indefinida';
    }
}

module.exports = YoJuegoUser;