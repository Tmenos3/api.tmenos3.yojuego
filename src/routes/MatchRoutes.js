let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let Match = require('../models/Match');
let fetch = require('request');
let PushNotification = require('../models/PushNotification');
let PushNotificationType = require('../constants/PushNotificationType');
let MatchInvitation = require('../models/MatchInvitation');
let MatchRepository = require('../repositories/MatchESRepository');
let PlayerRepository = require('../repositories/PlayerESRepository');
let MatchInvitationRepository = require('../repositories/MatchInvitationESRepository');
let DeviceESRepository = require('../repositories/DeviceESRepository');
let moment = require('moment');

let repoMatch = null;
let repoMatchInvitation = null;
let repoPlayer = null;
let repoDevices = null;
let notificationService = null;

class MatchRoutes extends Routes {
    constructor(esClient, notiServParam) {
        super();

        this._createMatch = this._createMatch.bind(this);
        this._getArrayFromString = this._getArrayFromString.bind(this);
        this._searchByUpcoming = this._searchByUpcoming.bind(this);
        this._sendNotifications = this._sendNotifications.bind(this);
        this._getMatchInvitations = this._getMatchInvitations.bind(this);
        this._getMatch = this._getMatch.bind(this);
        this._removePlayer = this._removePlayer.bind(this);
        this._confirmPlayer = this._confirmPlayer.bind(this);
        this._saveMatch = this._saveMatch.bind(this);
        this._updateMatch = this._updateMatch.bind(this);
        this._populatePendingPlayers = this._populatePendingPlayers.bind(this);
        this._populateConfirmedPlayers = this._populateConfirmedPlayers.bind(this);
        this._populateCanceledPlayers = this._populateCanceledPlayers.bind(this);
        this._fetchMatchesDetailConfirmedPlayers = this._fetchMatchesDetailConfirmedPlayers.bind(this);
        this._fetchMatchesDetailCanceledPlayers = this._fetchMatchesDetailCanceledPlayers.bind(this);
        this._fetchPlayersDetail = this._fetchPlayersDetail.bind(this);
        this._sendPushNotifications = this._sendPushNotifications.bind(this);
        this._getDevices = this._getDevices.bind(this);
        this._returnMatch = this._returnMatch.bind(this);
        this._fillMatchInfo = this._fillMatchInfo.bind(this);
        this._exitPlayer = this._exitPlayer.bind(this);
        this._cancelMatch = this._cancelMatch.bind(this);
        this._invitePlayers = this._invitePlayers.bind(this);
        this._getUserIds = this._getUserIds.bind(this);
        this._sendComment = this._sendComment.bind(this);
        this._sendMessageToWebsocket = this._sendMessageToWebsocket.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(MatchRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoMatch = new MatchRepository(esClient);
            repoMatchInvitation = new MatchInvitationRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
            repoDevices = new DeviceESRepository(esClient);
            notificationService = notiServParam;
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        //Send notification
        server.put('/match', super._bodyIsNotNull, this._createMatch, this._sendNotifications, this._returnMatch);
        //Send notification
        server.post('/match/:id', super._paramsIsNotNull, super._bodyIsNotNull, this._getMatch, this._updateMatch, this._saveMatch, this._returnMatch);
        //Send notification in this case?
        server.post('/match/:id/exit', super._paramsIsNotNull, this._getMatch, this._exitPlayer, this._saveMatch, this._returnMatch);
        //Send notification
        server.post('/match/:id/cancel', super._paramsIsNotNull, this._getMatch, this._cancelMatch, this._saveMatch, this._returnMatch);
        //Send notification
        server.post('/match/:id/invite', super._paramsIsNotNull, super._bodyIsNotNull, this._getMatch, this._invitePlayers, this._saveMatch, this._returnMatch);
        server.del('/match/:id/player/:playerId', super._paramsIsNotNull, this._getMatch, this._removePlayer, this._saveMatch, this._returnMatch);
        // server.post('/match/:id/rejectPlayer', super._paramsIsNotNull, this._getMatch, this._removePlayer, this._saveMatch, this._returnMatch);
        server.post('/match/:id/confirmPlayer', super._paramsIsNotNull, this._getMatch, this._confirmPlayer, this._saveMatch, this._returnMatch);
        server.put('/match/:id/comment', super._paramsIsNotNull, super._bodyIsNotNull, this._getMatch, this._sendComment,
            (req, res, next) => {
                res.json(200, { code: 200, resp: req.commentSent, message: 'Comment sent.' })
            });
        server.get('/match/upcoming', this._searchByUpcoming, this._populateCanceledPlayers, this._populateConfirmedPlayers, this._populatePendingPlayers, (req, res, next) => { res.json(200, { code: 200, resp: req.matches, message: null }) });
    }

    _returnMatch(req, res, next) {
        this._fillMatchInfo(req.match)
            .then((match) => {
                match.matchAudit = undefined;
                res.json(200, { code: 200, resp: match, message: null })
            });
    }

    _fillMatchInfo(match) {
        return new Promise((resolve, reject) => {
            let promises = [];

            match.confirmedPlayers.forEach((p) => {
                promises.push(
                    repoPlayer.get(p)
                        .then((resp) => {
                            return resp.resp;
                        })
                );
            });
            match.pendingPlayers.forEach((p) => {
                promises.push(
                    repoPlayer.get(p)
                        .then((resp) => {
                            return resp.resp;
                        })
                );
            });
            match.canceledPlayers.forEach((p) => {
                promises.push(
                    repoPlayer.get(p)
                        .then((resp) => {
                            return resp.resp;
                        })
                );
            });

            Promise.all(promises)
                .then((allPlayers) => {
                    for (let i = 0; i < match.confirmedPlayers.length; i++) {
                        let fullPlayer = allPlayers.find((p) => { return p._id === match.confirmedPlayers[i] });
                        match.confirmedPlayers[i] = fullPlayer;
                    }

                    for (let i = 0; i < match.pendingPlayers.length; i++) {
                        let fullPlayer = allPlayers.find((p) => { return p._id === match.pendingPlayers[i] });
                        match.pendingPlayers[i] = fullPlayer;
                    }

                    resolve(match);
                });
        });
    }

    _createMatch(req, res, next) {
        try {
            var match = new Match(req.body.title, new Date(req.body.date), req.body.fromTime, req.body.toTime, req.body.location, req.player._id, req.body.matchType);
            //Remove duplicates
            match.pendingPlayers = Array.from(new Set(req.body.pendingPlayers.concat([req.player._id])));

            match.matchAudit = {
                createdBy: req.player._id,
                createdOn: new Date(),
                createdFrom: req.body.platform || 'MOBILE_APP',
                modifiedBy: null,
                modifiedOn: null,
                modifiedFrom: null
            }

            repoMatch.add(match)
                .then((respMatch) => {
                    return repoMatch.get(respMatch.resp._id);
                })
                .then((respMatch) => {
                    req.match = respMatch.resp;
                    next();
                });
        } catch (error) {
            res.json(400, { code: 400, message: error.message, resp: error });
        }
    }

    _searchByUpcoming(req, res, next) {
        let formatDate = moment(new Date()).format('DD/MM/YYYY');
        repoMatch.getByPlayerIdAndDate(req.player._id, formatDate)
            .then((resp) => {
                req.matches = resp.resp;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _sendNotifications(req, res, next) {
        let notifications = this._getMatchInvitations(req.match.pendingPlayers, req.match._id, req.player._id, req.body.platform || 'MOBILE_APP');
        if (!notifications.length)
            next();
        else {
            repoMatchInvitation.addBulk(notifications)
                .then((resp) => {
                    this._sendPushNotifications(notifications);
                    next();
                }, (cause) => {
                    res.json(404, { code: 404, message: cause.message, resp: null });
                })
                .catch((err) => {
                    res.json(500, { code: 500, message: err.message, resp: null });
                });
        }
    }

    _getMatch(req, res, next) {
        repoMatch.get(req.params.id)
            .then((resp) => {
                if (resp.code === 404)
                    res.json(404, { code: 404, message: 'Match does not exist.', resp: null });
                else {
                    req.match = resp.resp;
                    next();
                }
            }, (cause) => {
                res.json(400, { code: 400, message: cause.message, resp: cause });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: error.message, resp: error });
            })
    }

    _removePlayer(req, res, next) {
        req.match.removeInvitedPlayer(req.params.playerId);
        req.match.removeConfirmedPlayer(req.params.playerId);
        next();
    }

    _invitePlayers(req, res, next) {
        req.body.players.forEach((p) => {
            req.match.addInvitedPlayer(p);
        });
        next();
    }

    _exitPlayer(req, res, next) {
        req.match.removeConfirmedPlayer(req.player._id);
        req.match.removeInvitedPlayer(req.player._id);
        req.match.addCanceledPlayers(req.player._id);
        next();
    }

    _cancelMatch(req, res, next) {
        req.match.cancel();
        next();
    }

    _confirmPlayer(req, res, next) {
        req.match.addConfirmPlayer(req.player._id);
        next();
    }

    _saveMatch(req, res, next) {
        req.match.matchAudit.modifiedBy = req.player._id;
        req.match.matchAudit.modifiedOn = new Date();
        req.match.matchAudit.modifiedFrom = 'MOBILE_APP';

        repoMatch.update(req.match)
            .then((resp) => {
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause.message, resp: cause });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: error.message, resp: error });
            })
    }

    _updateMatch(req, res, next) {
        let errorMessages = [];
        if (!req.body.title) errorMessages.push('Title required.');
        if (!req.body.date) errorMessages.push('Date required.');
        if (!req.body.fromTime) errorMessages.push('From time required.');
        if (!req.body.toTime) errorMessages.push('To time required.');
        if (!req.body.matchType) errorMessages.push('Match type required.');

        if (errorMessages.length)
            res.json(400, { code: 400, message: 'There are some invalid fields.', resp: errorMessages });
        else {
            req.match.title = req.body.title;
            req.match.date = new Date(req.body.date);
            req.match.fromTime = req.body.fromTime;
            req.match.toTime = req.body.toTime;
            req.match.matchType = parseInt(req.body.matchType);

            next();
        }
    }

    _getArrayFromString(stringList) {
        return stringList ? stringList.split(";") : [];
    }

    _getMatchInvitations(pendingPlayers, matchId, senderId, platform) {
        let notifications = [];

        for (let i = 0; i < pendingPlayers.length; i++) {
            if (pendingPlayers[i] !== senderId) {
                let newNotification = new MatchInvitation(matchId, pendingPlayers[i], senderId, 'PENDING', new Date());
                newNotification.matchInvitationAudit = {
                    createdBy: senderId, //We should store deviceId here
                    createdOn: new Date(),
                    createdFrom: platform,
                    modifiedBy: null,
                    modifiedOn: null,
                    modifiedFrom: null
                }
                notifications.push(newNotification);
            }
        }

        return notifications;
    }

    _populatePendingPlayers(req, res, next) {
        this._fetchMatchesDetailPendingPlayers(req.matches, 0)
            .then((ret) => {
                req.matches = ret;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: cause, resp: null });
            });
    }

    _populateConfirmedPlayers(req, res, next) {
        this._fetchMatchesDetailConfirmedPlayers(req.matches, 0)
            .then((ret) => {
                req.matches = ret;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: error, resp: null });
            });
    }

    _populateCanceledPlayers(req, res, next) {
        this._fetchMatchesDetailCanceledPlayers(req.matches, 0)
            .then((ret) => {
                req.matches = ret;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: 500, message: error, resp: null });
            });
    }

    _sendComment(req, res, next) {
        req.commentSent = req.match.addComment(req.player._id, req.body.comment, new Date());
        repoMatch.update(req.match)
            .then((resp) => {
                let ids = req.match.pendingPlayers.concat(req.match.confirmedPlayers).map(p => { return p; });
                return this._getUserIds(ids);
            })
            .then(userIds => {
                this._sendMessageToWebsocket(userIds, req.params.id, req.commentSent);
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _getUserIds(playerIds) {
        return new Promise((resolve, reject) => {
            let promises = [];

            playerIds.forEach((p) => {
                promises.push(
                    repoPlayer.get(p)
                        .then((resp) => {
                            return resp.resp.userid;
                        })
                );
            });

            Promise.all(promises)
                .then((allUserIds) => {
                    resolve(allUserIds);
                });
        });
    }

    _sendMessageToWebsocket(ids, matchId, comment) {
        let body = {
            ids,
            data: {
                matchId,
                comment,
                type: 'MATCH'
            }
        }
        fetch({
            url: 'http://localhost:8092/websocket/message',
            method: 'PUT',
            json: body
        },
            (err, res, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (res.statusCode !== 200) {
                    console.log('Status:', res.statusCode);
                } else {
                    // data is already parsed as JSON:
                    console.log(data.html_url);
                }
            });
    }

    _fetchMatchesDetailConfirmedPlayers(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                return this._fetchPlayersDetail(arr[pos].confirmedPlayers, 0)
                    .then((retPlayers) => {
                        arr[pos].confirmedPlayers = retPlayers;
                        return this._fetchMatchesDetailConfirmedPlayers(arr, ++pos)
                            .then((retMatch) => resolve(retMatch))
                    });
            }
        });
    }

    _fetchMatchesDetailPendingPlayers(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                return this._fetchPlayersDetail(arr[pos].pendingPlayers, 0)
                    .then((retPlayers) => {
                        arr[pos].pendingPlayers = retPlayers;
                        return this._fetchMatchesDetailPendingPlayers(arr, ++pos)
                            .then((retMatch) => resolve(retMatch))
                    });
            }
        });
    }

    _fetchMatchesDetailCanceledPlayers(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                return this._fetchPlayersDetail(arr[pos].canceledPlayers, 0)
                    .then((retPlayers) => {
                        arr[pos].canceledPlayers = retPlayers;
                        return this._fetchMatchesDetailCanceledPlayers(arr, ++pos)
                            .then((retMatch) => resolve(retMatch))
                    });
            }
        });
    }

    _fetchPlayersDetail(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                repoPlayer.get(arr[pos])
                    .then((response) => {
                        arr[pos] = response.resp;
                        arr[pos].playerAudit = undefined;

                        return this._fetchPlayersDetail(arr, ++pos)
                            .then((ret) => resolve(ret));
                    });
            }
        });
    }

    _sendPushNotifications(notifications) {
        // if (notifications.length) {
        //     let players = [];
        //     for (let i = 0; i < notifications.length; i++) {
        //         players.push(notifications[i].playerId);
        //     }

        //     try {
        //         this._fetchPlayersDetail(players, 0)
        //             .then((retPlayers) => {
        //                 let users = [];
        //                 for (let i = 0; i < retPlayers.length; i++) {
        //                     users.push(retPlayers[i].userid);
        //                 }

        //                 return this._getDevices(users, 0)
        //                     .then((devices) => {
        //                         let pushNotification = new PushNotification(PushNotificationType.INVITED_TO_MATCH, notifications[0].matchId);
        //                         notificationService.push(devices, pushNotification);
        //                     });
        //             });
        //     } catch (error) {

        //     }
        // }
    }

    _getDevices(arr, pos) {
        return new Promise((resolve, reject) => {
            if (arr.length == pos)
                resolve(arr);
            else {
                repoDevices.getByUserId(arr[pos])
                    .then((response) => {
                        arr[pos] = response.resp;
                        arr[pos].deviceAudit = undefined;

                        return this._getDevices(arr, ++pos)
                            .then((ret) => resolve(ret));
                    });
            }
        });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = MatchRoutes;