'use strict'
var UserType = require('../constants/UserType');
var User = require('./User');

class GoogleUser extends User {
    constructor(id, isLogged, token) {
        super(UserType.google, id, isLogged, token);
    }
}

module.exports = GoogleUser;