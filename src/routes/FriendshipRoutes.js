let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let Friendship = require('../models/Friendship');
let Player = require('../models/Player');
let FriendshipRepository = require('../repositories/FriendshipESRepository');
let PlayerRepository = require('../repositories/PlayerESRepository');
let moment = require('moment');

let repoPlayer = null;
let repoFriendship = null;

class FriendshipRoutes extends Routes {
    constructor(esClient) {
        super();

        this._getPlayer = this._getPlayer.bind(this);
        this._checkPlayerFriendship = this._checkPlayerFriendship.bind(this);
        this._checkFriendFriendship = this._checkFriendFriendship.bind(this);
        this._getFriendship = this._getFriendship.bind(this);
        this._getAllFriendships = this._getAllFriendships.bind(this);
        this._createFriendship = this._createFriendship.bind(this);
        this._acceptFriendship = this._acceptFriendship.bind(this);
        this._rejectFriendship = this._rejectFriendship.bind(this);
        this._deleteFriendship = this._deleteFriendship.bind(this);
        this._updateFriendshipsByFriend = this._updateFriendshipsByFriend.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(FriendshipRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/friendship/:id', super._paramsIsNotNull, this._getPlayer, this._getFriendship, this._checkPlayerFriendship, (req, res, next) => { res.json(200, { code: 200, resp: req.friendship, message: 'Friend created' }) });
        server.get('/friendship', this._getPlayer, this._getAllFriendships, (req, res, next) => { res.json(200, { code: 200, resp: req.friendships, message: null }) });
        server.post('/friendship/create', super._bodyIsNotNull, this._getPlayer, this._createFriendship, (req, res, next) => { res.json(200, { code: 200, resp: req.friendship, message: null }) });
        server.post('/friendship/:id/accetp', super._paramsIsNotNull, this._getPlayer, this._getFriendship, this._checkFriendFriendship, this._acceptFriendship, (req, res, next) => { res.json(200, { code: 200, resp: req.friendship, message: null }) });
        server.post('/friendship/:id/reject', super._paramsIsNotNull, this._getPlayer, this._getFriendship, this._checkFriendFriendship, this._rejectFriendship, (req, res, next) => { res.json(200, { code: 200, resp: req.friendship, message: null }) });
        server.del('/friendship/:id', super._paramsIsNotNull, this._getPlayer, this._getFriendship, this._checkPlayerFriendship, this._deleteFriendship, this._updateFriendshipsByFriend, (req, res, next) => { res.json(200, { code: 200, resp: req.friendship, message: null }) });
    }

    _getFriendship(req, res, next) {
        repoFriendship.get(req.params.id)
            .then((friendshipResp) => {
                if (!friendshipResp.resp) {
                    res.json(404, { code: 404, message: 'Friendship inexistente', resp: null });
                } else {
                    req.friendship = friendshipResp.resp;
                    next();
                }
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _getAllFriendships(req, res, next) {
        repoFriendship.getByPlayerId(req.player._id)
            .then((resp) => {
                req.friendships = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _createFriendship(req, res, next) {
        let info = {
            email: req.body.email,
            phone: req.body.phone,
            photo: null,
            firstName: null,
            lastName: null,
            nickName: null
        }

        let friendship = new Friendship(req.player._id, null, 'CREATED', info);
        friendship.friendshipAudit = {
            createdBy: req.player._id, //We should store deviceId here
            createdOn: new Date(),
            createdFrom: req.body.platform,
            modifiedBy: null,
            modifiedOn: null,
            modifiedFrom: null
        }
        repoFriendship.add(friendship)
            .then((resp) => {
                repoFriendship.get(resp.resp._id)
                    .then((friendshipResp) => {
                        req.friendship = friendshipResp.resp;
                        next();
                    }, (cause) => {
                        res.json(404, { code: 404, message: cause, resp: null });
                    })
                    .catch((err) => {
                        res.json(500, { code: 500, message: err, resp: null });
                    });
            }, (err) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _acceptFriendship(req, res, next) {
        let friendship = req.friendship;
        friendship.status = 'ACCEPTED';
        friendship.info = {
            photo: 'url_photo',
            firstName: req.player.firstName,
            lastName: req.player.lastName,
            nickName: req.player.nickName,
            telephone: '12431234'
        };
        friendship.friendshipAudit.modifiedBy = req.player._id; //We should store deviceId here
        friendship.friendshipAudit.modifiedOn = new Date();
        friendship.friendshipAudit.modifiedFrom = req.body.platform;


        repoFriendship.update(friendship)
            .then((resp) => {
                req.friendship = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _rejectFriendship(req, res, next) {
        let friendship = req.friendship;
        friendship.status = 'REJECTED'
        friendship.info = null;
        friendship.friendshipAudit.modifiedBy = req.body.platform; //We should store deviceId here
        friendship.friendshipAudit.modifiedOn = new Date();
        friendship.friendshipAudit.modifiedFrom = req.body.platform;

        repoFriendship.update(friendship)
            .then((resp) => {
                req.friendship = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _deleteFriendship(req, res, next) {
        let friendship = req.friendship;
        repoFriendship.delete(friendship)
            .then((resp) => {
                // buscar las amistades donde este player era friend y limpiar la info y el estado
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _updateFriendshipsByFriend(req, res, next) {
        next();
        //UPDATE BY QUERY
        // repoFriendship.get(req.friendship.friendId)
        //     .then((resp) => {
        //         for (let i = 0; i < resp.resp.length; i++) {
        //             let toUpdate = resp.resp[i];
        //             toUpdate.status = 'DELETED';
        //             toUpdate.info = null;

        //             repoFriendship.update(toUpdate)
        //                 .then((resp) => {

        //                 }, (cause) => {
        //                     res.json(404, { code: 404, message: cause, resp: null });
        //                 })
        //                 .catch((err) => {
        //                     res.json(500, { code: 500, message: err, resp: null });
        //                 });
        //         }
        //         next();
        //     }, (cause) => {
        //         res.json(404, { code: 404, message: cause, resp: null });
        //     })
        //     .catch((err) => {
        //         res.json(500, { code: 500, message: err, resp: null });
        //     });
    }

    _getPlayer(req, res, next) {
        repoPlayer.getByUserId(req.user.id)
            .then((resp) => {
                if (!resp.resp) {
                    res.json(404, { code: 404, message: 'Player inexistente', resp: null });
                } else {
                    req.player = resp.resp;
                    next();
                }
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _checkPlayerFriendship(req, res, next) {
        if (req.friendship.playerId != req.player._id)
            res.json(404, { code: 405, message: 'Inconsistencia entre Friendship y Player', resp: null });
        else
            next();
    }

    _checkFriendFriendship(req, res, next) {
        if (req.friendship.friendId != req.player._id)
            res.json(404, { code: 405, message: 'Inconsistencia entre Friendship y Friend', resp: null });
        else
            next();
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = FriendshipRoutes;