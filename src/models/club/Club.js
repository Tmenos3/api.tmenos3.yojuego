'use strict'
let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let EqualCondition = require('no-if-validator').EqualCondition;
let HasNotBlankSpacesCondition = require('no-if-validator').HasNotBlankSpacesCondition;


class Club {
    constructor(name, description, facilities, fields, allowOnLineBooking, allowOnLinePayment, cancelingTimeForFree, contactInfo, calendar) {
        let validator = new Validator();
        validator.addCondition(new HasNotBlankSpacesCondition(name).throw(new Error(Club.INVALID_NAME)));
        validator.addCondition(new HasNotBlankSpacesCondition(description).throw(new Error(Club.INVALID_DESCRIPTION)));

        validator.execute(() => {
            this.name = name;
            this.description = description;
        }, (err) => { throw err; });
    }

    static get INVALID_NAME() { return "Invalid Name"; }
    static get INVALID_DESCRIPTION() { return "Invalid Description"; }
}

module.exports = Club;