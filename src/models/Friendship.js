'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var InstanceOfCondition = require('../helpers/CommonValidator/InstanceOfCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');
var NotEqualCondition = require('../helpers/CommonValidator/NotEqualCondition');

class Friendship {
    constructor(sender, recipient) {
        var conditions = [
            new NotNullOrUndefinedCondition(sender, Friendship.INVALID_SENDER()),
            new NotNullOrUndefinedCondition(recipient, Friendship.INVALID_RECIPIENT()),
            new NotEqualCondition(sender, recipient, Friendship.INVALIDAD_FRIENDSHIP())
        ];
        var validator = new ValidationHelper(conditions, () => {
            this.sender = sender;
            this.recipient = recipient;
        }, (err) => { throw new Error(err); });
        validator.execute();
    }

    static INVALID_SENDER() {
        return "El REMITENTE es indefinido, nulo ó no es del tipo integer.";
    }
    static INVALID_RECIPIENT() {
        return "El DESTINATARIO es indefinido, nulo ó no es del tipo integer.";
    }
    static INVALIDAD_FRIENDSHIP() {
        return "El remitente y el destinatario no deben ser el mismo.";
    }
}

module.exports = Friendship;