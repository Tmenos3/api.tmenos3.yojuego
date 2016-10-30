'use strict'
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var HasNotBlankSpacesCondition = require('no-if-validator').HasNotBlankSpacesCondition;
var CustomCondition = require('no-if-validator').CustomCondition;
var InstanceOfCondition = require('no-if-validator').InstanceOfCondition;

class Player {
    constructor(nickName, birthDate, state, adminState, userid) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(nickName).throw(new Error(Player.INVALID_NICKNAME)));
        validator.addCondition(new HasNotBlankSpacesCondition(nickName).throw(new Error(Player.INVALID_NICKNAME_HAS_BLANKSPACES)));
        validator.addCondition(new CustomCondition(() => { return nickName.length >= 5 }).throw(new Error(Player.INVALID_NICKNAME_IS_SHORT)));
        validator.addCondition(new NotNullOrUndefinedCondition(birthDate).throw(new Error(Player.INVALID_BIRTHDATE)));
        validator.addCondition(new InstanceOfCondition(birthDate, Date).throw(new Error(Player.INVALID_DATE_TYPE)));
        validator.addCondition(new NotNullOrUndefinedCondition(state).throw(new Error(Player.INVALID_STATE)));
        validator.addCondition(new NotNullOrUndefinedCondition(adminState).throw(new Error(Player.INVALID_ADMIN_STATE)));
        validator.addCondition(new NotNullOrUndefinedCondition(userid).throw(new Error(Player.INVALID_USERID)));

        validator.execute(() => {
            this.nickName = nickName;
            this.birthDate = birthDate;
            this.state = state;
            this.adminState = adminState;
            this.userid = userid;
            this.teamMates = [];
        }, (err) => { throw err; });
    }

    addTeamMate(teamMateId) {
        if (this.teamMates.indexOf(teamMateId) == -1) {
            this.teamMates.push(teamMateId);
        }
    }

    removeTeamMate(teamMateId) {
        if (this.teamMates.indexOf(teamMateId) > -1) {
            this.teamMates.splice(this.teamMates.indexOf(teamMateId), 1);
        }
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
        return 'El estado es inválido. No debe ser nul ni indefinido.';
    }

    static get INVALID_ID() {
        return 'El ID es inválido. No debe ser null ni indefinido.';
    }

    static get INVALID_ADMIN_STATE_TYPE() {
        return 'El estado administrativo no es del tipo PlayerAdminState.';
    }

    static get INVALID_USERID() {
        return 'El userID no puede nulo o indefinido.';
    }
}

module.exports = Player;