'use strict'
let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let InstanceOfCondition = require('no-if-validator').InstanceOfCondition;
let HasNotBlankSpacesCondition = require('no-if-validator').HasNotBlankSpacesCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let _ = require('underscore');

class Club {
    constructor(name, description, facilities, allowOnlineBooking, allowOnlinePayment) {//, cancelingTimeForFree, contactInfo, calendar) {
        let validator = new Validator();
        validator.addCondition(new HasNotBlankSpacesCondition(name).throw(new Error(Club.INVALID_NAME)));
        validator.addCondition(new HasNotBlankSpacesCondition(description).throw(new Error(Club.INVALID_DESCRIPTION)));
        validator.addCondition(new InstanceOfCondition(facilities, Array).throw(new Error(Club.INVALID_FACILITIES)));
        validator.addCondition(new CustomCondition(() => {
            if (facilities instanceof Array) {
                return !_.any(facilities, (item) => { return !_.contains(Club.ALL_FACILITIES, item) });
            }
            return true;
        }).throw(new Error(Club.INVALID_FACILITIES)));
        validator.addCondition(new CustomCondition(() => {
            return allowOnlineBooking && allowOnlineBooking != null && typeof (allowOnlineBooking) === "boolean";
        }).throw(new Error(Club.INVALID_ALLOW_ONLINE_BOOKING)));
        validator.addCondition(new CustomCondition(() => {
            return allowOnlinePayment && allowOnlinePayment != null && typeof (allowOnlinePayment) === "boolean";
        }).throw(new Error(Club.INVALID_ALLOW_ONLINE_PAYMENT)));

        validator.execute(() => {
            this.name = name;
            this.description = description;
            this.facilities = facilities;
            this.allowOnlineBooking = allowOnlineBooking;
            this.allowOnlinePayment = allowOnlinePayment;
        }, (err) => { throw err; });
    }

    static get INVALID_NAME() { return 'Invalid Name'; }
    static get INVALID_DESCRIPTION() { return 'Invalid Description'; }
    static get INVALID_FACILITIES() { return 'Invalid Facilities'; }
    static get INVALID_ALLOW_ONLINE_BOOKING() { return 'Invalid Allow Online Booking'; }
    static get INVALID_ALLOW_ONLINE_PAYMENT() { return 'Invalid Allow Online Payment'; }

    static get FACILITY_MEN_LOCKER_ROOM() { return 'Men locker room' }
    static get FACILITY_MEN_SHOWERS() { return 'Men showers' }

    static get ALL_FACILITIES() {
        return [
            Club.FACILITY_MEN_LOCKER_ROOM,
            Club.FACILITY_MEN_SHOWERS
        ]
    }
}

module.exports = Club;