'use strict'
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class Invitation {
    constructor(sender, recipient, match, createdOn) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(sender).throw(new Error(Invitation.INVALID_SENDER)));
        validator.addCondition(new NotNullOrUndefinedCondition(recipient).throw(new Error(Invitation.INVALID_RECIPIENT)));
        validator.addCondition(new NotNullOrUndefinedCondition(match).throw(new Error(Invitation.INVALID_MATCH)));
        validator.addCondition(new NotNullOrUndefinedCondition(createdOn).throw(new Error(Invitation.INVALID_CREATEDON)));

        validator.execute(() => {
            this.sender = sender;
            this.recipient = recipient;
            this.match = match;
            this.createdOn = createdOn;
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

    static get INVALID_CREATEDON() {
        return 'La fecha de creación debe tener un valor';
    }
}

module.exports = Invitation;