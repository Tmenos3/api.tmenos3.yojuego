'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotHasBlankSpacesCondition = require('../helpers/CommonValidator/NotHasBlankSpacesCondition');
var NotLessCharacterLenghtCondition = require('../helpers/CommonValidator/NotLessCharacterLenghtCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class User {
    constructor(username, password, email) {
        var conditions = [
            new NotNullOrUndefinedCondition(username, User.INVALID_USERNAME()),
            new NotNullOrUndefinedCondition(password, User.INVALID_PASSWORD()),
            new NotNullOrUndefinedCondition(email, User.INVALID_EMAIL()),
            new NotHasBlankSpacesCondition(username, User.INVALID_USERNAME_HAS_BLANK_SPACE()),
            new NotHasBlankSpacesCondition(password, User.INVALID_PASSWORD_HAS_BLANK_SPACE()),
            new NotLessCharacterLenghtCondition(username, 5, User.INVALID_USERNAME_LENGHT()),
            new NotLessCharacterLenghtCondition(password, 5, User.INVALID_PASSWORD_LENGHT()),
            new CustomCondition(() => { return username !== password }, User.PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME())
        ];

        var validator = new ValidationHelper(conditions, () => {
            this.username = username;
            this.password = password;
            this.eMail = email;
        }, (err) => { throw new Error(err); });
        validator.execute();

        this.validateIfAValidEmail(email);
        this.username = username;
        this.password = password;
        this.eMail = email;
    }

    validateIfAValidEmail(eMailToValidate) {
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!reg.test(eMailToValidate)) {
            throw new Error(User.INVALID_EMAIL());
        }
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