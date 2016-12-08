'use strict'
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class Invitation {
    constructor(sender, recipient, match, createdOn, state) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(sender).throw(new Error(Invitation.INVALID_SENDER)));
        validator.addCondition(new NotNullOrUndefinedCondition(recipient).throw(new Error(Invitation.INVALID_RECIPIENT)));
        validator.addCondition(new NotNullOrUndefinedCondition(match).throw(new Error(Invitation.INVALID_MATCH)));
        validator.addCondition(new NotNullOrUndefinedCondition(createdOn).throw(new Error(Invitation.INVALID_CREATEDON)));

        validator.execute(() => {
            this.senderId = sender;
            this.recipientId = recipient;
            this.matchId = match;
            this.createdOn = createdOn;
            this.state = (state) ? state : 'pending';
        }, (err) => { throw err; });
    }

    accept() {
        this.state = 'accepted';
    }

    reject() {
        this.state = 'rejected';
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