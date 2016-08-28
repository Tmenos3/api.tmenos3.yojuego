'use strict'

var ValidationHelper = require('../helpers/CommonValidator/ValidationHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var InstanceOfCondition = require('../helpers/CommonValidator/InstanceOfCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class Friendship {
    constructor(user, friend) {
        var conditions = [
            new NotNullOrUndefinedCondition(user, Friendship.INVALID_USER()),
            new NotNullOrUndefinedCondition(friend, Friendship.INVALIDAD_FRIEND()),
            new InstanceOfCondition(user, Number, Friendship.INVALID_USER()),
            new InstanceOfCondition(friend, Number, Friendship.INVALIDAD_FRIEND())
        ];
        var validator = new ValidationHelper(conditions, () => {
            this.user = user;
            this.friend = friend;
        }, (err) => { throw new Error(err); });
        validator.execute();
    }

    static INVALID_USER() {
        return "El usuario es indefinido, nulo ó no es del tipo integer.";
    }

    static INVALIDAD_FRIEND() {
        return "El amigo es indefinido, nulo ó no es del tipo integer.";
    }
}

module.exports = Friendship;