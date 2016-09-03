'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');
var InstanceOfCondition = require('../helpers/CommonValidator/InstanceOfCondition');

class Match {
    constructor(tittle, date, fromTime, toTime, location, creator, matchType) {
        var conditions = [
            new NotNullOrUndefinedCondition(tittle, Match.INVALID_TITTLE()),
            new NotNullOrUndefinedCondition(date, Match.INVALID_DATE()),
            new NotNullOrUndefinedCondition(fromTime, Match.INVALID_TIME()),
            new CustomCondition(() => {
                var regex = /([01]\d|2[0-3]):([0-5]\d)/;
                return regex.test(fromTime)
            }, Match.INVALID_TIME_FORMAT()),
            new NotNullOrUndefinedCondition(toTime, Match.INVALID_TIME()),
            new CustomCondition(() => {
                var regex = /([01]\d|2[0-3]):([0-5]\d)/;
                return regex.test(toTime)
            }, Match.INVALID_TIME_FORMAT()),
            new NotNullOrUndefinedCondition(location, Match.INVALID_LOCATION()),
            new NotNullOrUndefinedCondition(creator, Match.INVALID_CREATOR()),
            new InstanceOfCondition(date, Date, Match.INVALID_DATE_TYPE()),
            new NotNullOrUndefinedCondition(matchType, Match.INVALID_MATCH_TYPE()),
        ];

        var validator = new ValidationHelper(conditions, () => {
            this.tittle = tittle;
            this.date = date;
            this.fromTime = fromTime;
            this.toTime = toTime;
            this.location = location;
            this.creator = creator;
            this.matchType = matchType;
        }, (err) => { throw new Error(err); });
        validator.execute();
        if (!this.creator instanceof Number) {
            throw new Error('No es number!!!');
        }
        this.players = [];
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
    static INVALID_TITTLE() {
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