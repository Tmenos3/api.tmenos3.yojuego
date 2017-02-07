var ESRepository = require('./ESRepository');
var User = require('../models/User');
var FacebookUser = require('../models/FacebookUser');
var GoogleUser = require('../models/GoogleUser');
var YoJuegoUser = require('../models/YoJuegoUser');
var UserType = require('../constants/UserType');

class UserESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(userId) {
        return new Promise((resolve, reject) => {
            super.get(userId, 'yojuego', 'user')
                .then((objRet) => {
                    let user = null;
                    switch (objRet.resp.source.type) {
                        case UserType.facebook:
                            user = new FacebookUser(objRet.resp.source.id);
                            break;
                        case UserType.google:
                            user = new GoogleUser(objRet.resp.source.id);
                            break;
                        case UserType.yoJuego:
                            user = new YoJuegoUser(objRet.resp.source.id, objRet.resp.source.password);
                            break;
                    }
                    user._id = objRet.resp._id;
                    user.userAudit = objRet.resp.source.userAudit;
                    resolve({ code: 200, message: null, resp: user });
                }, reject);
        });
    }

    getByIdAndType(id, type) {
        //TEST: not null, not undefined
        //TEST: instance of string both
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
                    if (response.hits.hits.length < 1) {
                        resolve({ code: 404, message: 'No users were found.', resp: null });
                    } else {
                        let user = null;

                        for (let i = 0; i < response.hits.hits.length; i++) {
                            switch (response.hits.hits[i]._source.type) {
                                case UserType.facebook:
                                    user = new FacebookUser(response.hits.hits[i]._source.id);
                                    break;
                                case UserType.google:
                                    user = new GoogleUser(response.hits.hits[i]._source.id);
                                    break;
                                case UserType.yoJuego:
                                    user = new YoJuegoUser(response.hits.hits[i]._source.id, response.hits.hits[i]._source.password);
                                    break;
                            }

                            user._id = response.hits.hits[i]._id;
                            user.userAudit = response.hits.hits[i]._source.userAudit;
                            break;
                        }

                        resolve({ code: 200, message: null, resp: user });
                    }
                }
            });
        });
    }

    add(user) {
        //TEST: not null, not undefined
        //TEST: instance of User
        //TEST: return a user
        return new Promise((resolve, reject) => {
            super.add(user, 'yojuego', 'user')
                .then((resp) => {
                    let newUser = null;
                    switch (user.type) {
                        case UserType.facebook:
                            newUser = new FacebookUser(user.id);
                            break;
                        case UserType.google:
                            newUser = new GoogleUser(user.id);
                            break;
                        case UserType.yoJuego:
                            newUser = new YoJuegoUser(user.id, user.password);
                            break;
                    }
                    newUser._id = resp.resp._id;
                    newUser.userAudit = user.userAudit;
                    resolve({ code: 200, message: UserESRepository.DOCUMENT_INSERTED, resp: newUser });
                }, reject)
        });
    }

    update(user) {
        //TEST: not null, not undefined
        //TEST: instance of User
        return new Promise((resolve, reject) => {
            if (user instanceof User) {
                let document = {
                    type: user.type,
                    id: user.id,
                    userAudit: user.userAudit
                };

                if (user.type == UserType.yoJuego) {
                    document.password = user.password;
                }
                super.update(user._id, document, 'yojuego', 'user')
                    .then((resp) => {
                        let user = null;
                        switch (resp._source.type) {
                            case UserType.facebook:
                                user = new FacebookUser(resp._source.id);
                                break;
                            case UserType.google:
                                user = new GoogleUser(resp._source.id);
                                break;
                            case UserType.yoJuego:
                                user = new YoJuegoUser(resp._source.id, resp._source.password);
                                break;
                        }
                        user._id = resp._id;
                        user.userAudit = resp._source.userAudit;
                        resolve({ code: 200, message: UserESRepository.DOCUMENT_UPDATED, resp: user });
                    }, reject);
            } else {
                reject({ code: 410, message: UserESRepository.INVALID_INSTANCE_USER, resp: null });
            }
        });
    }

    delete(user) {
        //TEST: not null, not undefined
        //TEST: instance of User
        return new Promise((resolve, reject) => {
            if (user instanceof User) {
                super.delete(user._id, 'yojuego', 'user').then(resolve, reject);
            } else {
                reject({ code: 410, message: UserESRepository.INVALID_INSTANCE_USER, resp: null });
            }
        });
    }

    static get INVALID_USER() {
        return "Invalid User";
    }

    static get INVALID_INSTANCE_USER() {
        return 'This instance is not a user';
    }
}

module.exports = UserESRepository