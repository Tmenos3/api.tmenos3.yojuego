'use strict'
import UserType from '../constants/UserType';
import User from '../models/User';

class FacebookUser extends User {
    constructor(id) {
        super(UserType.facebook, id);
    }
}

module.exports = FacebookUser;