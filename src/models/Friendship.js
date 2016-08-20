'use strict'

var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotIsTypeOfIntegerCondition = require('../helpers/CommonValidator/NotIsTypeOfIntegerCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class Friendship {
    constructor(user, friend) {
        var conditions = [
            new NotNullOrUndefinedCondition(user, Friendship.INVALID_USER()),
            new NotNullOrUndefinedCondition(friend, Friendship.INVALIDAD_FRIEND()),
            new NotIsTypeOfIntegerCondition(user, Friendship.INVALID_USER()),
            new NotIsTypeOfIntegerCondition(friend, Friendship.INVALIDAD_FRIEND())
        ];
        var validator = new CommonValidatorHelper(conditions, () => {
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