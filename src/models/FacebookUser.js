var User = require('./User');

class FacebookUser extends User {
    constructor(id, isLogged, token, oauthInfo) {
        super(User.TYPES.FACEBOOK, id, isLogged, token, oauthInfo);
    }
}

module.exports = FacebookUser;