'use strict'
var UserType = require('../constants/UserType');
var User = require('./User');

class FacebookUser extends User {
    constructor(id, isLogged, token, oauthInfo) {
        super(UserType.facebook, id, isLogged, token, oauthInfo);
    }
}

module.exports = FacebookUser;