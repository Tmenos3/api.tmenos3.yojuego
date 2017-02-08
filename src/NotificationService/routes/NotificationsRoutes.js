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

class NotificationsRoutes extends Routes {
    constructor(esClient) {
        super();

        this._getPlayer = this._getPlayer.bind(this);
        this._getFriendshipRequests = this._getFriendshipRequests.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(FriendshipRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
            repoFriendshipRequest = new FriendshipRequestRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/notifications/frienshipRequest', this._getPlayer, this._getFriendshipRequests, (req, res, next) => { res.json(200, { code: 200, resp: req.friendship, message: 'Friend created' }) });
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
                this._fetchFriendDetails(resp.resp, 0)
                    .then((ret) => {
                        req.friendships = ret;
                        next();
                    }, (cause) => {
                        res.json(404, { code: 404, message: cause, resp: null });
                    })
                    .catch((err) => {
                        res.json(500, { code: 500, message: err, resp: null });
                    });
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
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
                if (resp.resp)
                    friendId = resp.resp._id;

                let friendship = new Friendship(req.player._id, friendId, 'CREATED', req.body.email);
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
            }, (cause) => {

            })
            .catch((err) => {

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

    _sendNotification(req, res, next) {
        let newNotification = new FriendshipRequest(req.friendship._id, req.player._id, 'PENDING', new Date());
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
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = FriendshipRoutes;