'use strict'
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class User {
    constructor(type, id) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(User.INVALID_USER)));
        validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(User.INVALID_ID)));

        validator.execute(() => {
            this.type = type;
            this.id = id;
        }, (err) => { throw err; });
    }

    static get INVALID_USER() {
        return 'El tipo de usuario no puede ser nulo o indefinido';
    }

    static get INVALID_ID() {
        return 'El Id de usuario no puede ser nulo o indefinido';
    }
}

module.exports = User;