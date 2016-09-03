'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotHasBlankSpacesCondition = require('../helpers/CommonValidator/NotHasBlankSpacesCondition');
var NotLessCharacterLenghtCondition = require('../helpers/CommonValidator/NotLessCharacterLenghtCondition');
var InstanceOfCondition = require('../helpers/CommonValidator/InstanceOfCondition');
import PlayerAdminState from '../../src/constants/PlayerAdminState';
class Player {
    constructor(nickName, birthDate, state, adminState) {
        var conditions = [
            new NotNullOrUndefinedCondition(nickName, Player.INVALID_NICKNAME()),
            new NotHasBlankSpacesCondition(nickName, Player.INVALID_NICKNAME_HAS_BLANKSPACES()),
            new NotLessCharacterLenghtCondition(nickName, 5, Player.INVALID_NICKNAME_IS_SHORT()),
            new NotNullOrUndefinedCondition(birthDate, Player.INVALID_BIRTHDATE()),
            new InstanceOfCondition(birthDate, Date, Player.INVALID_DATE_TYPE()),
            new NotNullOrUndefinedCondition(state, Player.INVALID_STATE()),
            new NotNullOrUndefinedCondition(adminState, Player.INVALID_ADMIN_STATE())//,
            //new InstanceOfCondition(adminState, PlayerAdminState, Player.INVALID_ADMIN_STATE_TYPE()),
        ];
        var validator = new ValidationHelper(conditions, () => {
            this.id;
            this.nickName = nickName;
            this.birthDate = birthDate;
            this.state = state;
            this.adminState = adminState;
        }, (err) => { throw new Error(err); });
        validator.execute();
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
        return 'El estado es inválido. No debe ser nulo ni indefinido.';
    }

    static INVALID_ADMIN_STATE() {
        return 'El estado administrativo es inválido. No debe ser nulo ni indefinido.';
    }

    static INVALID_ADMIN_STATE_TYPE() {
        return 'El estado administrativo no es del tipo PlayerAdminState.';
    }
}

module.exports = Player;