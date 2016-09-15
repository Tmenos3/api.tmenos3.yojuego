'use strict'
var UserType = require('../constants/UserType');
var User = require('./User');

class FacebookUser extends User {
    constructor(id) {
        super(UserType.facebook, id);
    }
}

module.exports = FacebookUser;