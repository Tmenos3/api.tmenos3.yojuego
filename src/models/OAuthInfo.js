let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class OAuthInfo {
    constructor(authToken, refreshToken, xxx) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(authToken).throw(new Error(OAuthInfo.INVALID_AUTH_TOKEN)));
        validator.addCondition(new NotNullOrUndefinedCondition(refreshToken).throw(new Error(OAuthInfo.INVALID_REFRESH_TOKEN)));
        validator.addCondition(new NotNullOrUndefinedCondition(xxx).throw(new Error(OAuthInfo.INVALID_XXX)));

        validator.execute(() => {
            this.authToken = authToken;
            this.refreshToken = refreshToken;
            this.xxx = xxx;
        }, (err) => { throw err; });
    }

    static get INVALID_AUTH_TOKEN() {
        return 'Invalid OAuthToken';
    }

    static get INVALID_REFRESH_TOKEN() {
        return 'Invalid RefreshToken';
    }

    static get INVALID_XXX() {
        return 'Invalid XXX';
    }
}

module.exports = OAuthInfo;