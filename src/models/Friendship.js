'use strict'

import {
    Validator,
    NotNullOrUndefinedCondition,
    CustomCondition,
    EqualCondition
} from 'no-if-validator';

class Friendship {
    constructor(sender, recipient) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(sender).throw(new Error(Friendship.INVALID_SENDER)));
        validator.addCondition(new NotNullOrUndefinedCondition(recipient).throw(new Error(Friendship.INVALID_RECIPIENT)));
        validator.addCondition(new EqualCondition(sender, recipient).not().throw(new Error(Friendship.INVALIDAD_FRIENDSHIP)));

        validator.execute(() => {
            this.sender = sender;
            this.recipient = recipient;
        }, (err) => { throw err; });
    }

    static get INVALID_SENDER() {
        return "El REMITENTE es indefinido, nulo ó no es del tipo integer.";
    }
    static get INVALID_RECIPIENT() {
        return "El DESTINATARIO es indefinido, nulo ó no es del tipo integer.";
    }
    static get INVALIDAD_FRIENDSHIP() {
        return "El remitente y el destinatario no deben ser el mismo.";
    }
}

module.exports = Friendship;