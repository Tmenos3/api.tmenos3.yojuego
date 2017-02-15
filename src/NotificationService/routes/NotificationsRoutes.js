let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('../../routes/Routes');
let Friendship = require('../../models/Friendship');
let Player = require('../../models/Player');
let FriendshipRepository = require('../../repositories/FriendshipESRepository');
let PlayerRepository = require('../../repositories/PlayerESRepository');
let FriendshipRequestRepository = require('../repositories/FriendshipRequestESRepository');
let FriendshipRequest = require('../models/FriendshipRequest');

let moment = require('moment');

let repoPlayer = null;
let repoFriendship = null;
let repoFriendshipRequest = null;

class NotificationsRoutes extends Routes {
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

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(NotificationsRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
            repoFriendshipRequest = new FriendshipRequestRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/notifications/friendshiprequest', this._getPendingFriendshipRequests, this._populateFriendships, this._populatePlayers, (req, res, next) => { res.json(200, { code: 200, resp: req.friendshipRequests, message: null }) });
        server.post('/notifications/friendshiprequest/markasread', super._bodyIsNotNull, this._getFriendshipRequest, this._checkPlayer, this._markAsRead, this._returnFriendshipRequest);
        server.del('/notifications/friendshiprequest/delete', super._bodyIsNotNull, this._getFriendshipRequest, this._checkPlayer, this._delete, this._returnFriendshipRequest);
    }

    _returnFriendshipRequest(req, res, next) {
        req.friendshipRequest.friendshipRequestAudit = undefined;
        res.json(200, { code: 200, resp: req.friendshipRequest, message: null });
    }

    _checkPlayer(req, res, next) {
        if (req.player._id != req.friendshipRequest.playerId)
            res.json(404, { code: 405, message: 'Inconsistencia entre FriendshipRequest y Player', resp: null });
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
        repoFriendshipRequest.get(req.body.id)
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

module.exports = NotificationsRoutes;