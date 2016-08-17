'use strict'

var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');
// get an instance of mongoose and mongoose.Schema
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

class User {
    constructor(username, password, email) {
        var conditions = [
            new NotNullOrUndefinedCondition(username, User.INVALID_USERNAME()),
            new NotNullOrUndefinedCondition(password, User.INVALID_PASSWORD()),
            new NotNullOrUndefinedCondition(email, User.INVALID_EMAIL()),
            new CustomCondition(() => { return username !== password }, User.PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME())
        ];

        var validator = new CommonValidatorHelper(conditions, () => {
            this.username = username;
            this.password = password;
            this.eMail = email;
        }, (err) => { throw new Error(err); });
        validator.execute();

        this.validateIfUserNameHasBlankSpaces(username);
        this.validateIfPasswordHasBlankSpaces(password);
        this.validateIfUserNameBeMoreThanFiveCharaters(username);
        this.validateIfPasswordBeMoreThanFiveCharaters(password);
        this.username = username;
        this.password = password;
        this.eMail = email;
    }

    validateIfUserNameHasBlankSpaces(username) {
        if (this.hasBlankSpace(username)) {
            throw new Error(User.INVALID_USERNAME_HAS_BLANK_SPACE());
        }
    }

    validateIfPasswordHasBlankSpaces(password) {
        if (this.hasBlankSpace(password)) {
            throw new Error(User.INVALID_PASSWORD_HAS_BLANK_SPACE());
        }
    }

    hasBlankSpace(textToValidate) {
        return textToValidate.includes(' ');
    }

    validateIfUserNameBeMoreThanFiveCharaters(username) {
        if (this.hasMoreThanFiveCharacters(username) == false) {
            throw new Error(User.INVALID_USERNAME_LENGHT());
        }
    }

    validateIfPasswordBeMoreThanFiveCharaters(password) {
        if (this.hasMoreThanFiveCharacters(password) == false) {
            throw new Error(User.INVALID_PASSWORD_LENGHT());
        }
    }

    hasMoreThanFiveCharacters(textToValidate) {
        return textToValidate.length > 5;
    }

    equal(otherUser) {
        return this.username == otherUser.username;
    }

    static INVALID_USERNAME() {
        return 'Debe proveer un username válido (al menos 5 caracteres entre letras, numeros, puntos y unserscore).';
    }

    static INVALID_PASSWORD() {
        return 'Debe proveer un username válido (al menos 5 caracteres).';
    }

    static PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME() {
        return 'El password no puede ser igual al username.';
    }

    static INVALID_USERNAME_HAS_BLANK_SPACE() {
        return 'El nombre de usuario no puede tener espacios en blanco.';
    }

    static INVALID_PASSWORD_HAS_BLANK_SPACE() {
        return 'La contraseña tiene espacios en blanco.';
    }

    static INVALID_USERNAME_LENGHT() {
        return 'El nombre de usuario debe contener mas de 5 caracteres.';
    }

    static INVALID_PASSWORD_LENGHT() {
        return 'La contraseña debe contener mas de 5 caracteres.';
    }

    static INVALID_EMAIL() {
        return 'EL mail no es válido. No puede ser nulo y solo puede contener letras, números, puntos, undercore y hyphen';
    }
}

module.exports = User;

// set up a mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({ 
//     username: String, 
//     password: String, 
//     admin: Boolean 
// }));