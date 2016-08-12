 var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
 var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');

class PlayerProfile{
    constructor(nickname){
        var conditions = [
            new NotNullOrUndefinedCondition(nickname, PlayerProfile.INVALID_NICKNAME())
        ];
        
        var validator = new CommonValidatorHelper(conditions, () => { this.nickname = nickname; }, (err) => { throw new Error(err); });
        validator.execute();
    }

    changeNickname(newNickname){
        var conditions = [
            new NotNullOrUndefinedCondition(newNickname, PlayerProfile.INVALID_NICKNAME())
        ];
        
        var validator = new CommonValidatorHelper(conditions, () => { this.nickname = newNickname; }, (err) => { throw new Error(err); });
        validator.execute();
    }

    static INVALID_NICKNAME() {
        return "El nickname debe ser válido";
    }
}

module.exports = PlayerProfile;