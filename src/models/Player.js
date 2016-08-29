'use strict'
import Enum from 'es6-enum';
var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotHasBlankSpacesCondition = require('../helpers/CommonValidator/NotHasBlankSpacesCondition');
var NotLessCharacterLenghtCondition = require('../helpers/CommonValidator/NotLessCharacterLenghtCondition');
var InstanceOfCondition = require('../helpers/CommonValidator/InstanceOfCondition');

class Player {
    constructor(nickName, birthDate, state) {
        var conditions = [
            new NotNullOrUndefinedCondition(nickName, Player.INVALID_NICKNAME()),
            new NotHasBlankSpacesCondition(nickName, Player.INVALID_NICKNAME_HAS_BLANKSPACES()),
            new NotLessCharacterLenghtCondition(nickName, 5, Player.INVALID_NICKNAME_IS_SHORT()),
            new NotNullOrUndefinedCondition(birthDate, Player.INVALID_BIRTHDATE()),
            new InstanceOfCondition(birthDate, Date, Player.INVALID_DATE_TYPE()),
            new NotNullOrUndefinedCondition(state, Player.INVALID_STATE())
        ];
        var validator = new ValidationHelper(conditions, () => {
            this.nickName = nickName;
            this.birthDate = birthDate;
            this.state = state;
        }, (err) => { throw new Error(err); });
        validator.execute();
    }


    static playerStates() {
       return STATES = {
           NEW: { value: 0, name: "new" },
           OLD: { value: 1, name: "old" }
       };
    }

    equal(otherPlayer) {
        return this.nickName == otherPlayer.nickName;
    }

    static INVALID_NICKNAME() {
        return 'El nickName es inválido. No puede ser nulo ni indefinido.';
    }
    static INVALID_NICKNAME_HAS_BLANKSPACES() {
        return 'El nickName es inválido. No debe tener espacios en blanco.';
    }

    static INVALID_NICKNAME_IS_SHORT() {
        return 'El nickName es inválido. No debe tener menos de 5 caracteres.';
    }

    static INVALID_BIRTHDATE() {
        return 'La fecha de nacimiento es inválida. No puede ser nula ni indefinida.';
    }
    static INVALID_DATE_TYPE() {
        return 'El la fecha de nacimiento no es del tipo DATE.';
    }
    static INVALID_STATE() {
        return 'El estado es inválido. No debe ser nul ni indefinido.';
    }


}

module.exports = Player;