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

        this._getPlayer = this._getPlayer.bind(this);
        this._getFriendshipRequests = this._getFriendshipRequests.bind(this);
        this._fetchFriendshipsDetail = this._fetchFriendshipsDetail.bind(this);
        this._populateFriendships = this._populateFriendships.bind(this);
        this._populatePlayers = this._populatePlayers.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(NotificationsRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
            repoFriendshipRequest = new FriendshipRequestRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/notifications/frienshipRequest', this._getPlayer, this._getFriendshipRequests, this._populateFriendships, this._populatePlayers, (req, res, next) => { res.json(200, { code: 200, resp: req.friendshipRequests, message: null }) });
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

    _getFriendshipRequests(req, res, next) {
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