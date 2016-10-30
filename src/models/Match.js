'use strict'
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var InstanceOfCondition = require('no-if-validator').InstanceOfCondition;
var CustomCondition = require('no-if-validator').CustomCondition;
var IsNumberCondition = require('no-if-validator').IsNumberCondition;

class Match {
    constructor(title, date, fromTime, toTime, location, creator, matchType) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(title).throw(new Error(Match.INVALID_TITLE)));
        validator.addCondition(new NotNullOrUndefinedCondition(date).throw(new Error(Match.INVALID_DATE)));
        validator.addCondition(new NotNullOrUndefinedCondition(fromTime).throw(new Error(Match.INVALID_TIME)));
        validator.addCondition(new CustomCondition(() => {
            var regex = /([01]\d|2[0-3]):([0-5]\d)/;
            return regex.test(fromTime)
        }).throw(new Error(Match.INVALID_TIME_FORMAT)));
        validator.addCondition(new NotNullOrUndefinedCondition(toTime).throw(new Error(Match.INVALID_TIME)));
        validator.addCondition(new CustomCondition(() => {
            var regex = /([01]\d|2[0-3]):([0-5]\d)/;
            return regex.test(toTime)
        }).throw(new Error(Match.INVALID_TIME_FORMAT)));
        validator.addCondition(new NotNullOrUndefinedCondition(location).throw(new Error(Match.INVALID_LOCATION)));
        validator.addCondition(new NotNullOrUndefinedCondition(creator).throw(new Error(Match.INVALID_CREATOR)));
        validator.addCondition(new InstanceOfCondition(date, Date).throw(new Error(Match.INVALID_DATE_TYPE)));
        validator.addCondition(new NotNullOrUndefinedCondition(matchType).throw(new Error(Match.INVALID_MATCH_TYPE)));

        validator.execute(() => {
            this.title = title;
            this.date = date;
            this.fromTime = fromTime;
            this.toTime = toTime;
            this.location = location;
            this.creator = creator;
            this.matchType = matchType;
            this.players = [];
        }, (err) => { throw err; });
    }

    static INVALID_DATE() {
        return 'La fecha no debe ser invalida.';
    }
    static INVALID_TIME() {
        return 'La hora no debe ser invalida.';
    }
    static INVALID_TIME_FORMAT() {
        return 'El formato de la hora es inválido.';
    }
    static INVALID_LOCATION() {
        return 'La ubicación no debe ser invalida.';
    }
    static INVALID_CREATOR() {
        return 'El creador es inválido.';
    }
    static INVALID_CREATOR_TYPE() {
        return 'El creador debe ser del tipo Number.';
    }
    static INVALID_PLAYER() {
        return 'El jugardor es inválido.'
    }
    static INVALID_TITLE() {
        return 'El título no puede ser nulo o indefinido.';
    }
    static INVALID_DATE_TYPE() {
        return 'La fecha debe ser del tipo Date.'
    }
    static INVALID_MATCH_TYPE() {
        return 'El tipo de partido no puede ser nulo o indefinido.';
    }
}

module.exports = Match;