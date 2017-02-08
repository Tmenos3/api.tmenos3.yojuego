let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let EqualCondition = require('no-if-validator').EqualCondition;

class Friendship {
    constructor(playerId, friendId, status, email) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(Friendship.INVALID_PLAYER)));

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
    static get INVALIDAD_FRIENDSHIP() {
        return "El player y el friend no deben ser el iguales.";
    }
}

module.exports = Friendship;