'use strict'

import { Validator,
    CustomCondition,
    NotNullOrUndefinedCondition,
    HasNotBlankSpacesCondition,
    NotLessCharacterLenghtCondition,
    InstanceOfCondition } from 'no-if-validator';

class Player {
    constructor(nickName, birthDate, state) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(nickName).throw(new Error(Player.INVALID_NICKNAME())));
        validator.addCondition(new HasNotBlankSpacesCondition(nickName).throw(new Error(Player.INVALID_NICKNAME_HAS_BLANKSPACES())));
        validator.addCondition(new CustomCondition(() => { return nickName.length >= 5 }).throw(new Error(Player.INVALID_NICKNAME_IS_SHORT())));
        validator.addCondition(new NotNullOrUndefinedCondition(birthDate).throw(new Error(Player.INVALID_BIRTHDATE())));
        validator.addCondition(new InstanceOfCondition(birthDate, Date).throw(new Error(Player.INVALID_DATE_TYPE())));
        validator.addCondition(new NotNullOrUndefinedCondition(state).throw(new Error(Player.INVALID_STATE())));
        validator.execute(() => {
            this.nickName = nickName;
            this.birthDate = birthDate;
            this.state = state;
        }, (err) => { throw err; });
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