'use strict'

var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class Invitation {
    constructor(sender, match) {
        var conditions = [
            new NotNullOrUndefinedCondition(sender, Invitation.INVALID_SENDER()),
            new NotNullOrUndefinedCondition(match, Invitation.INVALID_MATCH())
        ];

        var validator = new CommonValidatorHelper(conditions, () => {
            this.sender = sender;
            this.match = match;
        }, (err) => { throw new Error(err); });
        validator.execute();

         this.guests = [];
    }

    static INVALID_SENDER() {
        return 'El remitente debe contener un valor.';
    }

    static INVALID_MATCH(){
        return 'El partido debe tener un valor';
    }
}

module.exports = Invitation;