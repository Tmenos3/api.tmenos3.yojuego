'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');
var InstanceOfCondition = require('../helpers/CommonValidator/InstanceOfCondition');

class Match {
    constructor(tittle, date, time, location, creator) {
        var conditions = [
            new NotNullOrUndefinedCondition(tittle, Match.INVALID_TITTLE()),
            new NotNullOrUndefinedCondition(date, Match.INVALID_DATE()),
            new NotNullOrUndefinedCondition(time, Match.INVALID_TIME()),
            new NotNullOrUndefinedCondition(location, Match.INVALID_LOCATION()),
            new NotNullOrUndefinedCondition(creator, Match.INVALID_CREATOR()),
            new InstanceOfCondition(date, Date, Match.INVALID_DATE_TYPE())
        ];

        var validator = new ValidationHelper(conditions, () => {
            this.tittle = tittle;
            this.date = date;
            this.time = time;
            this.location = location;
            this.creator = creator;
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
}

module.exports = Match;