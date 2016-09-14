var ESRepository = require('./ESRepository');
var User = require('../models/User');

class UserESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    getById(userId) {
        return new Promise((resolve, reject) => {
            super.getById(userId, 'yojuego', 'user')
                .then((objRet) => {
                    var user = new User(objRet.userType);
                    user.id = objRet._id;
                    resolve(user);
                }, reject);
        });
    }


    getBy(criteria) {
        return new Promise((resolve, reject) => {
            super.getBy(criteria, 'yojuego', 'user')
                .then((list) => {
                    var ret = [];

                    for (let i = 0; i < list.length; i++) {
                        var user = new User(list[i]._source.type);
                        user.id = list[i]._id;
                        user.type = list[i]._source.type;
                        ret.push(user);
                    }

                    resolve(ret);
                }, reject);
        });
    }

    add(user) {
        return new Promise((resolve, reject) => {
            super.add(user, 'yojuego', 'user')
                .then(resolve, reject);
        });
    }

    static get INVALID_USER() {
        return "Invalid User";
    }
}

module.exports = UserESRepository