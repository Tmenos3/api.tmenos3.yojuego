'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class Invitation {
    constructor(sender, recipient, match) {
        var conditions = [
            new NotNullOrUndefinedCondition(sender, Invitation.INVALID_SENDER()),
            new NotNullOrUndefinedCondition(recipient, Invitation.INVALID_RECIPIENT()),
            new NotNullOrUndefinedCondition(match, Invitation.INVALID_MATCH())
        ];

        var validator = new ValidationHelper(conditions, () => {
            this.sender = sender;
            this.recipient = recipient;
            this.match = match;
        }, (err) => { throw new Error(err); });
        validator.execute();

        this.guests = [];
    }

    static INVALID_SENDER() {
        return 'El remitente debe contener un valor.';
    }

    static INVALID_MATCH() {
        return 'El partido debe tener un valor';
    }

    static INVALID_RECIPIENT() {
        return 'El DESTINATARIO debe contener un valor.';
    }
}

module.exports = Invitation;