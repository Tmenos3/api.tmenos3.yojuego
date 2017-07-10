let User = require('./User');

class GoogleUser extends User {
    constructor(id, isLogged, token, oauthInfo) {
        super(User.TYPES.GOOGLE, id, isLogged, token, oauthInfo);
    }
}

module.exports = GoogleUser;