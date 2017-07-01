let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let Friendship = require('../models/Friendship');
let Player = require('../models/Player');
let FriendshipRepository = require('../repositories/FriendshipESRepository');
let PlayerRepository = require('../repositories/PlayerESRepository');
let FriendshipRequestRepository = require('../NotificationService/repositories/FriendshipRequestESRepository');
let FriendshipRequest = require('../NotificationService/models/FriendshipRequest');

let moment = require('moment');

let repoPlayer = null;
let repoFriendship = null;
let repoFriendshipRequest = null;

class FriendshipRoutes extends Routes {
    constructor(esClient) {
        super();

        this._checkPlayerFriendship = this._checkPlayerFriendship.bind(this);
        this._checkFriendFriendship = this._checkFriendFriendship.bind(this);
        this._getFriendship = this._getFriendship.bind(this);
        this._getAllFriendships = this._getAllFriendships.bind(this);
        this._createFriendship = this._createFriendship.bind(this);
        this._acceptFriendship = this._acceptFriendship.bind(this);
        this._rejectFriendship = this._rejectFriendship.bind(this);
        this._deleteFriendship = this._deleteFriendship.bind(this);
        this._updateFriendshipsByFriend = this._updateFriendshipsByFriend.bind(this);
        this._fetchFriendDetails = this._fetchFriendDetails.bind(this);
        this._createFriendshipRequest = this._createFriendshipRequest.bind(this);
        this._addNewFriend = this._addNewFriend.bind(this);
        this._checkPending = this._checkPending.bind(this);
        this._returnFriendship = this._returnFriendship.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(FriendshipRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
            repoFriendshipRequest = new FriendshipRequestRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/friendship/:id', super._paramsIsNotNull, this._getFriendship, this._checkPlayerFriendship, this._returnFriendship);
        server.get('/friendship', this._getAllFriendships, (req, res, next) => { res.json(200, { code: 200, resp: req.friendships, message: null }) });
        server.post('/friendship/create', super._bodyIsNotNull, this._createFriendship, this._createFriendshipRequest, this._returnFriendship);
        server.post('/friendship/accept', super._bodyIsNotNull, this._getFriendship, this._checkPending, this._checkFriendFriendship, this._acceptFriendship, this._addNewFriend, this._returnFriendship);
        server.post('/friendship/reject', super._bodyIsNotNull, this._getFriendship, this._checkPending, this._checkFriendFriendship, this._rejectFriendship, this._returnFriendship);
        server.del('/friendship/:id', super._paramsIsNotNull, this._getFriendship, this._checkPlayerFriendship, this._deleteFriendship, this._updateFriendshipsByFriend, this._returnFriendship);
    }

    _returnFriendship(req, res, next) {
        req.friendship.friendshipAudit = undefined;
        res.json(200, { code: 200, resp: req.friendship, message: null })
    }

    _getFriendship(req, res, next) {
        let id = null;
        if (req.params && req.params.id)
            id = req.params.id;
        else
            id = req.body.id;

        repoFriendship.get(id)
            .then((friendshipResp) => {
                if (!friendshipResp.resp) {
                    res.json(404, { code: 404, message: 'Friendship inexistente', resp: null });
                } else {
                    req.friendship = friendshipResp.resp;
                    next();
                }
            }, (cause) => {
                res.json(404, { code: 404, message: cause.message, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err.message, resp: null });
            });
    }

    _getAllFriendships(req, res, next) {
        repoFriendship.getByPlayerId(req.player._id)
            .then((resp) => {
                this._fetchFriendDetails(resp.resp, 0)
                    .then((ret) => {
                        req.friendships = ret;
                        next();
                    }, (cause) => {
                        res.json(404, { code: 404, message: cause.message, resp: null });
                    })
                    .catch((err) => {
                        res.json(500, { code: 500, message: err.message, resp: null });
                    });
            }, (cause) => {
                res.json(404, { code: 404, message: cause.message, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err.message, resp: null });
            });
    }

    _fetchFriendDetails(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                if (arr[pos].status == 'ACCEPTED') {
                    repoPlayer.get(arr[pos].friendId)
                        .then((response) => {
                            arr[pos].info = {
                                firstName: response.resp.firstName,
                                lastName: response.resp.lastName,
                                nickName: response.resp.nickName,
                                photo: response.resp.photo,
                                email: response.resp.email,
                                phone: response.resp.phone
                            };

                            return this._fetchFriendDetails(arr, ++pos)
                                .then((ret) => resolve(ret));
                        });
                }
                else {
                    arr[pos].info = {
                        firstName: null,
                        lastName: null,
                        nickName: null,
                        photo: null,
                        email: arr[pos].email,
                        phone: null
                    };
                    return this._fetchFriendDetails(arr, ++pos)
                        .then((ret) => resolve(ret));
                }
            }
        });
    }

    _createFriendship(req, res, next) {
        repoPlayer.getByEmail(req.body.email)
            .then((resp) => {
                let friendId = null;
                if (!resp.resp) {
                    res.json(404, { code: 404, message: "Tu amigo todavia no se registro.", resp: null });
                } else {
                    let friendship = new Friendship(req.player._id, resp.resp._id, 'CREATED', req.body.email);
                    friendship.friendshipAudit = {
                        createdBy: req.player._id, //We should store deviceId here
                        createdOn: new Date(),
                        createdFrom: req.body.platform || 'MOBILE_APP',
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
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _acceptFriendship(req, res, next) {
        let friendship = req.friendship;
        friendship.status = 'ACCEPTED';
        friendship.friendshipAudit.modifiedBy = req.player._id; //We should store deviceId here
        friendship.friendshipAudit.modifiedOn = new Date();
        friendship.friendshipAudit.modifiedFrom = req.body.platform || 'MOBILE_APP';

        repoFriendship.update(friendship)
            .then((resp) => {
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause.message, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err.message, resp: null });
            });
    }

    _rejectFriendship(req, res, next) {
        let friendship = req.friendship;
        friendship.status = 'REJECTED'
        friendship.friendshipAudit.modifiedBy = req.player._id; //We should store deviceId here
        friendship.friendshipAudit.modifiedOn = new Date();
        friendship.friendshipAudit.modifiedFrom = req.body.platform || 'MOBILE_APP';

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

    _createFriendshipRequest(req, res, next) {
        let newNotification = new FriendshipRequest(req.friendship._id, req.friendship.friendId, 'PENDING', new Date());
        newNotification.friendshipRequestAudit = {
            createdBy: req.player._id, //We should store deviceId here
            createdOn: new Date(),
            createdFrom: req.body.platform || 'MOBILE_APP',
            modifiedBy: null,
            modifiedOn: null,
            modifiedFrom: null
        }
        repoFriendshipRequest.add(newNotification)
            .then((resp) => {
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause.message, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err.message, resp: null });
            });
    }

    _addNewFriend(req, res, next) {
        repoPlayer.get(req.friendship.playerId)
            .then((playerResp) => {
                if (!playerResp.resp) {
                    res.json(404, { code: 404, message: 'Player inexistente', resp: null });
                } else {
                    let friendship = new Friendship(req.player._id, playerResp.resp._id, 'ACCEPTED', playerResp.resp.email);
                    friendship.friendshipAudit = {
                        createdBy: req.player._id, //We should store deviceId here
                        createdOn: new Date(),
                        createdFrom: req.body.platform || 'MOBILE_APP',
                        modifiedBy: null,
                        modifiedOn: null,
                        modifiedFrom: null
                    }
                    repoFriendship.add(friendship)
                        .then((resp) => {
                            repoFriendship.get(resp.resp._id)
                                .then((friendshipResp) => {
                                    req.newFriendship = friendshipResp.resp;
                                    next();
                                }, (cause) => {
                                    res.json(404, { code: 404, message: cause.message, resp: null });
                                })
                                .catch((err) => {
                                    res.json(500, { code: 500, message: err.message, resp: null });
                                });
                        }, (err) => {
                            res.json(404, { code: 404, message: cause.message, resp: null });
                        })
                        .catch((err) => {
                            res.json(500, { code: 500, message: err.message, resp: null });
                        });
                }
            }, (cause) => {
                res.json(404, { code: 404, message: cause.message, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err.message, resp: null });
            });
    }

    _checkPending(req, res, next) {
        if (req.friendship.status != 'CREATED')
            res.json(404, { code: 405, message: 'This frienship cannot be accepted.', resp: null });
        else
            next();
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = FriendshipRoutes;