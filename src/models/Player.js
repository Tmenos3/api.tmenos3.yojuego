'use strict'

import { Validator,
    NotNullOrUndefinedCondition,
    HasNotBlankSpacesCondition,
    CustomCondition,
    InstanceOfCondition } from 'no-if-validator';

import PlayerAdminState from '../../src/constants/PlayerAdminState';

class Player {
    constructor(nickName, birthDate, state, adminState) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(nickName).throw(new Error(Player.INVALID_NICKNAME)));
        validator.addCondition(new HasNotBlankSpacesCondition(nickName).throw(new Error(Player.INVALID_NICKNAME_HAS_BLANKSPACES)));
        validator.addCondition(new CustomCondition(() => { return nickName.length >= 5 }).throw(new Error(Player.INVALID_NICKNAME_IS_SHORT)));
        validator.addCondition(new NotNullOrUndefinedCondition(birthDate).throw(new Error(Player.INVALID_BIRTHDATE)));
        validator.addCondition(new InstanceOfCondition(birthDate, Date).throw(new Error(Player.INVALID_DATE_TYPE)));
        validator.addCondition(new NotNullOrUndefinedCondition(state).throw(new Error(Player.INVALID_STATE)));
        validator.addCondition(new NotNullOrUndefinedCondition(adminState).throw(new Error(Player.INVALID_ADMIN_STATE)));

        validator.execute(() => {
            this.id;
            this.nickName = nickName;
            this.birthDate = birthDate;
            this.state = state;
            this.adminState = adminState;
        }, (err) => { throw err; });
    }

    equal(otherPlayer) {
        return this.nickName == otherPlayer.nickName;
    }

    static get INVALID_NICKNAME() {
        return 'El nickName es inválido. No puede ser nulo ni indefinido.';
    }
    static get INVALID_NICKNAME_HAS_BLANKSPACES() {
        return 'El nickName es inválido. No debe tener espacios en blanco.';
    }

    static get INVALID_NICKNAME_IS_SHORT() {
        return 'El nickName es inválido. No debe tener menos de 5 caracteres.';
    }

    static get INVALID_BIRTHDATE() {
        return 'La fecha de nacimiento es inválida. No puede ser nula ni indefinida.';
    }
    static get INVALID_DATE_TYPE() {
        return 'El la fecha de nacimiento no es del tipo DATE.';
    }
    static get INVALID_STATE() {
        return 'El estado es inválido. No debe ser nulo ni indefinido.';
    }

    static get INVALID_ADMIN_STATE() {
        return 'El estado administrativo es inválido. No debe ser nulo ni indefinido.';
    }

    static get INVALID_ADMIN_STATE_TYPE() {
        return 'El estado administrativo no es del tipo PlayerAdminState.';
    }
}

module.exports = Player;