'use strict'

class Club {
    constructor(description, facilities, fields, allowOnLineBooking, allowOnLinePayment, cancelingTimeForFree, contactInfo, calendar) {
        this.description = description;
        this.facilities = facilities;
        this.fields = fields;
        this.allowOnLineBooking = allowOnLineBooking;
        this.allowOnLinePayment = allowOnLinePayment;
        this.cancelingTimeForFree = cancelingTimeForFree;
        this.contactInfo = contactInfo;
        this.calendar = calendar;
    }
}

module.exports = Club;