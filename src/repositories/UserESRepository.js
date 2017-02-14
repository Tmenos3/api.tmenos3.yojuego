let ESRepository = require('./ESRepository');
let User = require('../models/User');
let FacebookUser = require('../models/FacebookUser');
let GoogleUser = require('../models/GoogleUser');
let YoJuegoUser = require('../models/YoJuegoUser');
let UserType = require('../constants/UserType');

class UserESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._mapUser = this._mapUser.bind(this);
        this._getDocument = this._getDocument.bind(this);
        this._getQueryByIdAndType = this._getQueryByIdAndType.bind(this);
    }

    get(userId) {
        return super.get(userId, 'yojuego', 'user')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'User does not exist', resp: null };
                } else {
                    let user = this._mapUser(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: user };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByIdAndType(id, type) {
        //TEST: not null, not undefined
        //TEST: instance of string both
        return super.getBy(this._getQueryByIdAndType(id, type), 'yojuego', 'user')
            .then((objRet) => {
                if (objRet.resp.length < 1)
                    return { code: 404, message: 'No users were found.', resp: null };

                let user = this._mapUser(objRet.resp[0]._id, objRet.resp[0]._source);
                return { code: 200, message: null, resp: user };
            }, (error) => { return Promise.reject(error); });
    }

    add(user) {
        //TEST: not null, not undefined
        //TEST: instance of User
        //TEST: return a user
        return super.add(user, 'yojuego', 'user')
            .then((resp) => {
                let newUser = this._mapUser(resp.resp._id, user);
                return { code: 200, message: UserESRepository.DOCUMENT_INSERTED, resp: newUser };
            }, (error) => { return Promise.reject(error); });
    }

    update(user) {
        //TEST: not null, not undefined
        //TEST: instance of User
        if (user instanceof User) {
            let document = this._getDocument(user);
            return super.update(user._id, document, 'yojuego', 'user')
                .then((resp) => {
                    return { code: 200, message: UserESRepository.DOCUMENT_UPDATED, resp: user };
                }, (error) => { return Promise.reject(error); });
        } else {
            return Promise.reject({ code: 410, message: UserESRepository.INVALID_INSTANCE_USER, resp: null });
        }
    }

    delete(user) {
        //TEST: not null, not undefined
        //TEST: instance of User
        if (user instanceof User) {
            return super.delete(user._id, 'yojuego', 'user');
        } else {
            return Promise.reject({ code: 410, message: UserESRepository.INVALID_INSTANCE_USER, resp: null });
        }
    }

    _mapUser(id, source) {
        let user = null;

        switch (source.type) {
            case UserType.facebook:
                user = new FacebookUser(source.id, source.isLogged, source.token);
                break;
            case UserType.google:
                user = new GoogleUser(source.id, source.isLogged, source.token);
                break;
            case UserType.yoJuego:
                user = new YoJuegoUser(source.id, source.password, source.isLogged, source.token);
                break;
        }

        user._id = id;
        user.userAudit = source.userAudit;

        return user;
    }

    _getDocument(user) {
        let document = {
            type: user.type,
            id: user.id,
            isLogged: user.isLogged,
            token: user.token,
            userAudit: {
                lastAccess: user.userAudit.lastAccess,
                createdBy: user.userAudit.createdBy,
                createdOn: user.userAudit.createdOn,
                createdFrom: user.userAudit.createdFrom,
                modifiedBy: user.userAudit.modifiedBy,
                modifiedOn: user.userAudit.modifiedOn,
                modifiedFrom: user.userAudit.modifiedFrom
            }
        };

        if (user.type == UserType.yoJuego) {
            document.password = user.password;
        }

        return document;
    }

    _getQueryByIdAndType(id, type) {
        return {
            "bool": {
                "filter": [
                    { "term": { "type": type } },
                    { "term": { "id": id } }
                ]
            }
        };
    }

    static get INVALID_USER() {
        return "Invalid User";
    }

    static get INVALID_INSTANCE_USER() {
        return 'This instance is not a user';
    }
}

module.exports = UserESRepository