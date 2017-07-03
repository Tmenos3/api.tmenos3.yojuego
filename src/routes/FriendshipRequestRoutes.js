let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let moment = require('moment');
let Routes = require('./Routes');
let Friendship = require('../models/Friendship');
let Player = require('../models/Player');
let FriendshipRepository = require('../repositories/FriendshipESRepository');
let PlayerRepository = require('../repositories/PlayerESRepository');
let FriendshipRequestRepository = require('../repositories/FriendshipRequestESRepository');
let FriendshipRequest = require('../models/FriendshipRequest');

let repoPlayer = null;
let repoFriendship = null;
let repoFriendshipRequest = null;

class FriendshipRequestRoutes extends Routes {
    constructor(esClient) {
        super();

        this._getPendingFriendshipRequests = this._getPendingFriendshipRequests.bind(this);
        this._fetchFriendshipsDetail = this._fetchFriendshipsDetail.bind(this);
        this._populateFriendships = this._populateFriendships.bind(this);
        this._populatePlayers = this._populatePlayers.bind(this);
        this._markAsRead = this._markAsRead.bind(this);
        this._returnFriendshipRequest = this._returnFriendshipRequest.bind(this);
        this._delete = this._delete.bind(this);
        this._checkPlayer = this._checkPlayer.bind(this);
        this._checkPending = this._checkPending.bind(this);
        this._checkFriendFriendshipRequest = this._checkFriendFriendshipRequest.bind(this);
        this._acceptFriendshipRequest = this._acceptFriendshipRequest.bind(this);
        this._rejectFriendshipRequest = this._rejectFriendshipRequest.bind(this);
        this._addNewFriend = this._addNewFriend.bind(this);
        this._updateSenderFriendship = this._updateSenderFriendship.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(FriendshipRequestRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
            repoFriendshipRequest = new FriendshipRequestRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/friendshiprequest', this._getPendingFriendshipRequests, this._populateFriendships, this._populatePlayers, (req, res, next) => { res.json(200, { code: 200, resp: req.friendshipRequests, message: null }) });
        server.post('/friendshiprequest/:id/markasread', super._paramsIsNotNull, this._getFriendshipRequest, this._checkPlayer, this._markAsRead, this._returnFriendshipRequest);
        server.del('/friendshiprequest/:id', super._paramsIsNotNull, this._getFriendshipRequest, this._checkPlayer, this._delete, this._returnFriendshipRequest);
        server.get('/friendshiprequest/:id', super._paramsIsNotNull, this._getFriendshipRequest, this._returnFriendshipRequest);
        server.post('/friendshiprequest/:id/accept', super._paramsIsNotNull, this._getFriendshipRequest, this._checkPending, this._checkFriendFriendshipRequest, this._acceptFriendshipRequest, this._addNewFriend, this._updateSenderFriendship, this._returnFriendshipRequest);
        server.post('/friendshiprequest/:id/reject', super._paramsIsNotNull, this._getFriendshipRequest, this._checkPending, this._checkFriendFriendshipRequest, this._rejectFriendshipRequest, this._returnFriendshipRequest);
    }

    _returnFriendshipRequest(req, res, next) {
        this._fetchFriendshipsDetail([req.friendshipRequest], 0)
            .then((ret) => {
                return this._fetchPlayersDetail(ret, 0);
            })
            .then((ret) => {
                req.friendshipRequest = ret[0];
                req.friendshipRequest.friendshipRequestAudit = undefined;
                res.json(200, { code: 200, resp: req.friendshipRequest, message: null });
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _checkFriendFriendshipRequest(req, res, next) {
        if (req.friendshipRequest.playerId != req.player._id)
            res.json(404, { code: 405, message: 'Inconsistencia entre Friendship y Friend', resp: null });
        else
            next();
    }

    _checkPending(req, res, next) {
        if (req.friendshipRequest.status != 'PENDING')
            res.json(404, { code: 405, message: 'This frienship request cannot be accepted.', resp: null });
        else
            next();
    }

    _acceptFriendshipRequest(req, res, next) {
        req.friendshipRequest.status = 'ACCEPTED';
        req.friendshipRequest.friendshipRequestAudit.modifiedBy = req.player._id; //We should store deviceId here
        req.friendshipRequest.friendshipRequestAudit.modifiedOn = new Date();
        req.friendshipRequest.friendshipRequestAudit.modifiedFrom = 'MOBILE_APP';

        repoFriendshipRequest.update(req.friendshipRequest)
            .then((resp) => {
                req.friendshipRequest = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause.message, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err.message, resp: null });
            });
    }

    _rejectFriendshipRequest(req, res, next) {
        req.friendshipRequest.status = 'REJECTED'
        req.friendshipRequest.friendshipRequestAudit.modifiedBy = req.player._id; //We should store deviceId here
        req.friendshipRequest.friendshipRequestAudit.modifiedOn = new Date();
        req.friendshipRequest.friendshipRequestAudit.modifiedFrom = req.body.platform || 'MOBILE_APP';

        repoFriendship.update(req.friendshipRequest)
            .then((resp) => {
                req.friendshipRequest = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _checkPlayer(req, res, next) {
        if (req.player._id != req.friendshipRequest.playerId)
            res.json(405, { code: 405, message: 'Inconsistencia entre FriendshipRequest y Player', resp: null });
        else
            next();
    }

    _delete(req, res, next) {
        next();
    }

    _getPendingFriendshipRequests(req, res, next) {
        repoFriendshipRequest.getPendingByPlayerId(req.player._id)
            .then((resp) => {
                req.friendshipRequests = resp.resp;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _getFriendshipRequest(req, res, next) {
        repoFriendshipRequest.get(req.params.id)
            .then((resp) => {
                if (!resp.resp)
                    res.json(404, { code: 404, message: 'FriendshipRequest inexistente', resp: null });
                else {
                    req.friendshipRequest = resp.resp;
                    next();
                }
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _markAsRead(req, res, next) {
        req.friendshipRequest.status = 'READ';
        req.friendshipRequest.receivedOn = new Date();
        req.friendshipRequest.friendshipRequestAudit.modifiedBy = req.player._id; //We should store deviceId here
        req.friendshipRequest.friendshipRequestAudit.modifiedOn = new Date();
        req.friendshipRequest.friendshipRequestAudit.modifiedFrom = req.body.platform || 'MOBILE_APP';

        repoFriendshipRequest.update(req.friendshipRequest)
            .then((resp) => {
                req.friendshipRequest = resp.resp;
                req.friendshipRequest.friendshipRequestAudit = undefined;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _populateFriendships(req, res, next) {
        this._fetchFriendshipsDetail(req.friendshipRequests, 0)
            .then((ret) => {
                req.friendshipRequests = ret;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _populatePlayers(req, res, next) {
        this._fetchPlayersDetail(req.friendshipRequests, 0)
            .then((ret) => {
                req.friendshipRequests = ret;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _addNewFriend(req, res, next) {
        repoPlayer.get(req.friendshipRequest.playerId)
            .then((playerResp) => {
                if (!playerResp.resp) {
                    res.json(404, { code: 404, message: 'Player inexistente', resp: null });
                } else {
                    let friendship = new Friendship(req.player._id, playerResp.resp._id, 'ACCEPTED', playerResp.resp.email);
                    friendship.friendshipAudit = {
                        createdBy: req.player._id, //We should store deviceId here
                        createdOn: new Date(),
                        createdFrom: 'MOBILE_APP',
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

    _updateSenderFriendship(req, res, next) {
        repoFriendship.get(req.friendshipRequest.friendshipId)
            .then((resp) => {
                if (!resp.resp) {
                    res.json(404, { code: 404, message: 'Invalid friendship', resp: null });
                } else {
                    resp.resp.status = 'ACCEPTED';
                    resp.resp.friendshipAudit.modifiedBy = req.player._id;
                    resp.resp.friendshipAudit.modifiedOn = new Date();
                    resp.resp.friendshipAudit.modifiedFrom = 'MOBILE_APP';

                    repoFriendship.update(resp.resp)
                        .then((resp) => {
                            next();
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

    _fetchFriendshipsDetail(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                repoFriendship.get(arr[pos].friendshipId)
                    .then((response) => {
                        arr[pos].friendship = response.resp;
                        arr[pos].friendship.friendshipAudit = undefined;

                        return this._fetchFriendshipsDetail(arr, ++pos)
                            .then((ret) => resolve(ret));
                    });
            }
        });
    }

    _fetchPlayersDetail(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                repoPlayer.get(arr[pos].friendship.playerId)
                    .then((response) => {
                        arr[pos].sender = response.resp;
                        arr[pos].sender.playerAudit = undefined;

                        return this._fetchPlayersDetail(arr, ++pos)
                            .then((ret) => resolve(ret));
                    });
            }
        });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = FriendshipRequestRoutes;