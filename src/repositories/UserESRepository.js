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
                    var user = new User(objRet.source.type, objRet.source.userid);
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
                        var user = new User(list[i]._source.type, list[i]._source.userid);
                        ret.push(user);
                    }

                    resolve(ret);
                }, reject);
        });
    }

    getByUserId(id, type) {
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "user",
                "body": {
                    "query": {
                        "bool": {
                            "filter": [
                                { "term": { "type": type } },
                                { "term": { "id": id } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let user = null;

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        user = new User(response.hits.hits[i]._source.type, response.hits.hits[i]._source.id);
                        user._id = response.hits.hits[i]._id;
                    }

                    resolve(user);
                }
            });
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