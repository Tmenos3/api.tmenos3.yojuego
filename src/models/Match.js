'use strict'

var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class Match {
    constructor(date, time, location, creator) {
        var conditions = [
            new NotNullOrUndefinedCondition(date, Match.INVALID_DATE()),
            new NotNullOrUndefinedCondition(time, Match.INVALID_TIME()),
            new NotNullOrUndefinedCondition(location, Match.INVALID_LOCATION()),
            new NotNullOrUndefinedCondition(creator, Match.INVALID_CREATOR())
        ];

        var validator = new CommonValidatorHelper(conditions, () => {
            this.date = date;
            this.time = time;
            this.location = location;
            this.creator = creator;
        }, (err) => { throw new Error(err); });
        validator.execute();

        this.players = [];
    }

    addPlayer(player) {
        var conditions = [
            new NotNullOrUndefinedCondition(player, Match.INVALID_PLAYER())
        ];
        var validator = new CommonValidatorHelper(conditions, () => {
            this.players.push(player);
        }, (err) => { throw new Error(err); });
        validator.execute();
    }

    removePlayer(player) {
        var conditions = [
            new NotNullOrUndefinedCondition(player, Match.INVALID_PLAYER())
        ];
        var validator = new CommonValidatorHelper(conditions, () => {
            this.players = this.players.filter(function (element) {
                return element.username !== player.username;
            });
        }, (err) => { throw new Error(err); });
        validator.execute();
    }

    static INVALID_DATE() {
        return 'La fecha no debe ser invalida.';
    }
    static INVALID_TIME() {
        return 'La hora no debe ser invalida.';
    }
    static INVALID_LOCATION() {
        return 'La ubicación no debe ser invalida.';
    }
    static INVALID_CREATOR() {
        return 'El creador es inválido.';
    }

    static INVALID_PLAYER() {
        return 'El jugardor es inválido.'
    }
}

module.exports = Match;