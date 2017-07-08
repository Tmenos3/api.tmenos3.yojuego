let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let EqualCondition = require('no-if-validator').EqualCondition;
let CustomCondition = require('no-if-validator').CustomCondition;

class Friendship {
    constructor(playerId, friendId, status, email, auditInfo) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(Friendship.ERRORS.INVALID_PLAYER)));
        validator.addCondition(new NotNullOrUndefinedCondition(friendId).throw(new Error(Friendship.ERRORS.INVALID_FRIEND)));
        validator.addCondition(new NotNullOrUndefinedCondition(status).throw(new Error(Friendship.ERRORS.INVALID_STATUS)));
        validator.addCondition(new NotNullOrUndefinedCondition(email).throw(new Error(Friendship.ERRORS.INVALID_MAIL)));
        validator.addCondition(new EqualCondition(playerId, friendId).not().throw(new Error(Friendship.ERRORS.INCONSISTENT_PLAYER_FRIEND)));
        validator.addCondition(new CustomCondition(() => { return this._isValidStatus(status); }).throw(new Error(Friendship.ERRORS.STATUS_NOT_ALLOWED)));

        validator.execute(() => {
            this.playerId = playerId;
            this.friendId = friendId;
            this.email = email;
            this.status = status;
            this.auditInfo = auditInfo || null;
        }, (err) => { throw err; });
    }

    isAccepted() {
        return this.status === Friendship.STATUS.ACCEPTED;
    }

    isRejected() {
        return this.status === Friendship.STATUS.REJECTED;
    }

    isDeleted() {
        return this.status === Friendship.STATUS.DELETED;
    }

    accept() {
        this.status = Friendship.STATUS.ACCEPTED;
    }

    reject() {
        this.status = Friendship.STATUS.REJECTED;
    }

    delete() {
        this.status = Friendship.STATUS.DELETED;
    }

    _isValidStatus(status) {
        return Friendship.STATUS[status] !== null && Friendship.STATUS[status] !== undefined;
    }

    static get ERRORS() {
        return {
            INVALID_PLAYER: "El PLAYER es indefinido, nulo ó no es del tipo integer.",
            INVALID_FRIEND: "El FRIEND es indefinido, nulo ó no es del tipo integer.",
            INVALID_STATUS: "El status no puede ser null ni undefined.",
            INVALID_MAIL: "El mail no puede ser null ni undefined.",
            INCONSISTENT_PLAYER_FRIEND: "El friend y el player no pueden ser iguales.",
            STATUS_NOT_ALLOWED: "Status no permitido."
        }
    }

    static get STATUS() {
        return {
            ACCEPTED: "ACCEPTED",
            REJECTED: "REJECTED",
            DELETED: "DELETED",
            CREATED: "CREATED"
        }
    }
}

module.exports = Friendship;