var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotIsTypeOfIntegerCondition = require('../helpers/CommonValidator/NotIsTypeOfIntegerCondition');

class PlayerProfile {
    constructor(playerID) {
        var conditions = [
            new NotNullOrUndefinedCondition(playerID, PlayerProfile.INVALID_PALYERID()),
            new NotIsTypeOfIntegerCondition(playerID, PlayerProfile.INVALID_PALYERID()),
        ];
        var validator = new CommonValidatorHelper(conditions, () => {
            this.playerID = playerID;
        }, (err) => {
            throw new Error(err);
        });
        validator.execute();
    }

    static INVALID_PALYERID() {
        return "El ID de jugador es indefinido, nulo ó no es del tipo integer.";
    }
}

module.exports = PlayerProfile;