'use strict'

import { Validator,
         NotNullOrUndefinedCondition } from 'no-if-validator';

class Invitation {
    constructor(sender, recipient, match) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(sender).throw(new Error(Invitation.INVALID_SENDER)));
        validator.addCondition(new NotNullOrUndefinedCondition(recipient).throw(new Error(Invitation.INVALID_RECIPIENT)));
        validator.addCondition(new NotNullOrUndefinedCondition(match, recipient).throw(new Error(Invitation.INVALID_MATCH)));

        validator.execute(() => {
            this.id;
            this.sender = sender;
            this.recipient = recipient;
            this.match = match;
            this.guests = [];
        }, (err) => { throw err; });
    }

    static get INVALID_SENDER() {
        return 'El remitente debe contener un valor.';
    }

    static get INVALID_MATCH() {
        return 'El partido debe tener un valor';
    }

    static get INVALID_RECIPIENT() {
        return 'El DESTINATARIO debe contener un valor.';
    }
}

module.exports = Invitation;