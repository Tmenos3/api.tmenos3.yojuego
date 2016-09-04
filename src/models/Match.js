'use strict'

import { Validator,
    NotNullOrUndefinedCondition,
    InstanceOfCondition,
    CustomCondition } from 'no-if-validator';

class Match {
    constructor(tittle, date, fromTime, toTime, location, creator, matchType) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(tittle).throw(new Error(Match.INVALID_TITTLE)));
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
            this.tittle = tittle;
            this.date = date;
            this.fromTime = fromTime;
            this.toTime = toTime;
            this.location = location;
            this.creator = creator;
            this.matchType = matchType;
            this.players = [];

            if (!this.creator instanceof Number) {
                throw new Error('No es number!!!');
            }
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