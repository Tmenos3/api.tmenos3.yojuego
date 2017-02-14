'use strict'
var UserType = require('../constants/UserType');
var User = require('./User');

class FacebookUser extends User {
    constructor(id, isLogged, token) {
        super(UserType.facebook, id, isLogged, token);
    }
}

module.exports = FacebookUser;