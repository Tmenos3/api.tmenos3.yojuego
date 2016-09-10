'use strict'
import UserType from '../constants/UserType';
import User from '../models/User';

class GoogleUser extends User {
    constructor(id) {
        super(UserType.google, id);
    }
}

module.exports = GoogleUser;