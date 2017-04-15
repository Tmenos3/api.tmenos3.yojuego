'use strict'
var UserType = require('../constants/UserType');
var User = require('./User');

class GoogleUser extends User {
    constructor(id, isLogged, token, oauthInfo) {
        super(UserType.google, id, isLogged, token, oauthInfo);
    }
}

module.exports = GoogleUser;