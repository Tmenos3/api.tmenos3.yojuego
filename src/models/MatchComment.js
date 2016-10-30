'use strict'
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var InstanceOfCondition = require('no-if-validator').InstanceOfCondition;

class MatchComment {
    constructor(id, owner, text, writtenOn) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(MatchComment.INVALID_ID)));
        validator.addCondition(new NotNullOrUndefinedCondition(owner).throw(new Error(MatchComment.INVALID_OWNER)));
        validator.addCondition(new NotNullOrUndefinedCondition(text).throw(new Error(MatchComment.INVALID_TEXT)));
        validator.addCondition(new NotNullOrUndefinedCondition(writtenOn).throw(new Error(MatchComment.INVALID_WRITTENON)));
        validator.addCondition(new InstanceOfCondition(writtenOn, Date).throw(new Error(MatchComment.INVALID_WRITTENON)));

        validator.execute(() => {
            this.id = id;
            this.owner = owner;
            this.text = text;
            this.writtenOn = writtenOn;
        }, (err) => { throw err; });
    }

    static get INVALID_ID() {
        return 'El id del comentario no puede ser null ni indefinido';
    }

    static get INVALID_OWNER() {
        return 'El owner del comentario no puede ser null ni indefinido';
    }

    static get INVALID_TEXT() {
        return 'El texto del comentario no puede ser null ni indefinido';
    }

    static get INVALID_WRITTENON() {
        return 'La fecha del comentario no puede ser null ni indefinido';
    }
}

module.exports = MatchComment;