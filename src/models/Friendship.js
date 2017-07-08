let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let EqualCondition = require('no-if-validator').EqualCondition;

class Friendship {
    constructor(playerId, friendId, status, email) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(Friendship.INVALID_PLAYER)));
        validator.addCondition(new NotNullOrUndefinedCondition(friendId).throw(new Error(Friendship.INVALID_FRIEND)));
        validator.addCondition(new NotNullOrUndefinedCondition(status).throw(new Error(Friendship.INVALID_STATUS)));
        validator.addCondition(new NotNullOrUndefinedCondition(email).throw(new Error(Friendship.INVALID_MAIL)));
        validator.addCondition(new EqualCondition(playerId, friendId).not().throw(new Error(Friendship.INCONSISTENT_PLAYER_FRIEND)));

        validator.execute(() => {
            this.playerId = playerId;
            this.friendId = friendId;
            this.email = email;
            this.status = status;
        }, (err) => { throw err; });
    }
 
    static get INVALID_PLAYER() {
        return "El PLAYER es indefinido, nulo ó no es del tipo integer.";
    }

    static get INVALID_FRIEND() {
        return "El FRIEND es indefinido, nulo ó no es del tipo integer.";
    }

    static get INVALID_STATUS() {
        return "El status no puede ser null ni undefined.";
    }

    static get INVALID_MAIL() {
        return "El mail no puede ser null ni undefined.";
    }

    static get INCONSISTENT_PLAYER_FRIEND() {
        return "El friend y el player no pueden ser iguales.";
    }
}

module.exports = Friendship;