'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotHasBlankSpacesCondition = require('../helpers/CommonValidator/NotHasBlankSpacesCondition');
var NotLessCharacterLenghtCondition = require('../helpers/CommonValidator/NotLessCharacterLenghtCondition');
var NotIsTypeOfIntegerCondition = require('../helpers/CommonValidator/NotIsTypeOfIntegerCondition');

class Player {
    constructor(nickName, userID) {
        var conditions = [
            new NotNullOrUndefinedCondition(nickName, Player.INVALID_NICKNAME()),
            new NotHasBlankSpacesCondition(nickName, Player.INVALID_NICKNAME_HAS_BLANKSPACES()),
            new NotLessCharacterLenghtCondition(nickName, 5, Player.INVALID_NICKNAME_IS_SHORT()),
            new NotNullOrUndefinedCondition(userID, Player.INVALID_USER()),
            new NotIsTypeOfIntegerCondition(userID, Player.INVALID_USER_TYPE())
        ];
        var validator = new ValidationHelper(conditions, () => {
            this.nickName = nickName;
            this.userID = userID;
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
    static INVALID_USER() {
        return 'El usuario es inválido. No puede ser nulo ni indefinido.';
    }
    static INVALID_USER_TYPE() {
        return 'El usuario es inválido. No es del tipo integer.';
    }
}

module.exports = Player;