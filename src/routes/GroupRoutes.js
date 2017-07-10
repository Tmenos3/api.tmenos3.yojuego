let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let Group = require('../models/Group');
let GroupRepository = require('../repositories/GroupESRepository');
let FriendshipRepository = require('../repositories/FriendshipESRepository');
let PlayerRepository = require('../repositories/PlayerESRepository');
let moment = require('moment');
let fetch = require('request');

let repoFriendship = null;
let repoGroup = null;
let repoPlayer = null;

class GroupRoutes extends Routes {
    constructor(esClient) {
        super();

        this._addPlayers = this._addPlayers.bind(this);
        this._removePlayer = this._removePlayer.bind(this);
        this._auditGroup = this._auditGroup.bind(this);
        this._updateGroup = this._updateGroup.bind(this);
        this._getAllGroups = this._getAllGroups.bind(this);
        this._createGroup = this._createGroup.bind(this);
        this._deleteGroup = this._deleteGroup.bind(this);
        this._makeAdminPlayer = this._makeAdminPlayer.bind(this);
        this._checkPlayerMember = this._checkPlayerMember.bind(this);
        this._checkPlayerFriends = this._checkPlayerFriends.bind(this);
        this._fillGroupsInfo = this._fillGroupsInfo.bind(this);
        this._checkPlayerAdmin = this._checkPlayerAdmin.bind(this);
        this._getGroupMiddleware = this._getGroupMiddleware.bind(this);
        this._addMiddlewares = this._addMiddlewares.bind(this);
        this._checkParams = this._checkParams.bind(this);
        this._exitFromGroup = this._exitFromGroup.bind(this);
        this._returnGroup = this._returnGroup.bind(this);
        this._sendMessage = this._sendMessage.bind(this);
        this._getUserIds = this._getUserIds.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(GroupRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoGroup = new GroupRepository(esClient);
            repoFriendship = new FriendshipRepository(esClient);
            repoPlayer = new PlayerRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        this._addMiddlewares(server);

        server.get('/group/:id', this._checkPlayerMember, (req, res, next) => { res.json(200, { code: 200, resp: req.group, message: 'Group created' }) });
        server.post('/group/:id', super._bodyIsNotNull, this._checkPlayerMember, this._updateGroup, (req, res, next) => { res.json(200, { code: 200, resp: req.group, message: 'Group updated' }) });
        server.get('/group', this._getAllGroups, this._fillGroupsInfo, (req, res, next) => { res.json(200, { code: 200, resp: req.groups, message: null }) });
        server.put('/group', super._bodyIsNotNull, this._checkPlayerFriends, this._createGroup, this._returnGroup);
        server.post('/group/:id/players', this._checkPlayerAdmin, this._addPlayers, this._updateGroup, this._returnGroup);
        server.del('/group/:id/player/:playerId', this._removePlayer, this._updateGroup, this._returnGroup);
        server.post('/group/:id/makeadmin', this._makeAdminPlayer, this._updateGroup, this._returnGroup);
        server.del('/group/:id', this._checkPlayerAdmin, this._deleteGroup, (req, res, next) => { res.json(200, { code: 200, resp: req.group, message: null }) });
        server.post('/group/:id/exit', this._checkPlayerMember, this._exitFromGroup, (req, res, next) => { res.json(200, { code: 200, resp: req.group, message: null }) });
        server.put('/group/:id/message', this._paramsIsNotNull, super._bodyIsNotNull, this._checkPlayerMember, this._sendMessage,
            (req, res, next) => {
                res.json(200, { code: 200, resp: req.messageSent, message: 'Message sent.' })
            });
    }

    _addMiddlewares(server) {
        server.use(this._checkParams());
        server.use(this._getGroupMiddleware());
    }

    _checkParams() {
        return (req, res, next) => {
            if ((req.url.split('/')[1]) !== 'group')
                next();
            else {
                if (!(req.url.split('/')[2]))
                    next();
                else
                    super._paramsIsNotNull(req, res, next);
            }
        }
    }

    _getGroupMiddleware() {
        return (req, res, next) => {
            if ((req.url.split('/')[1]) !== 'group')
                next();
            else {
                if (!(req.url.split('/')[2]))
                    next();
                else
                    repoGroup.get(req.params.id)
                        .then((groupResp) => {
                            if (!groupResp.resp) {
                                res.json(404, { code: 404, message: 'Grupo inexistente', resp: null });
                            } else {
                                req.group = groupResp.resp;
                                next();
                            }
                        }, (cause) => {
                            res.json(404, { code: 404, message: cause, resp: null });
                        })
                        .catch((err) => {
                            res.json(500, { code: 500, message: err, resp: null });
                        });
            }
        }
    }

    _returnGroup(req, res, next) {
        this._fillGroupInfo(req.group)
            .then((group) => {
                group.auditInfo = undefined;
                res.json(200, { code: 200, resp: group, message: null })
            });
    }

    _getAllGroups(req, res, next) {
        repoGroup.getByPlayerId(req.player._id)
            .then((resp) => {
                req.groups = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _createGroup(req, res, next) {
        let group = new Group(req.body.players.concat([req.player._id]), [req.player._id], req.body.description, req.body.photo);
        group.auditInfo = {
            createdBy: req.body.platform || 'MOBILE_APP', //We should store deviceId here
            createdOn: new Date(),
            createdFrom: req.body.platform || 'MOBILE_APP',
            modifiedBy: null,
            modifiedOn: null,
            modifiedFrom: null
        }

        repoGroup.add(group)
            .then((resp) => {
                repoGroup.get(resp.resp._id)
                    .then((groupResp) => {
                        req.group = groupResp.resp;
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

    _addPlayers(req, res, next) {
        try {
            req.body.players.forEach((p) => { req.group.addPlayer(req.player._id, p); });
            next();
        } catch (error) {
            res.json(404, { code: 404, message: error, resp: null });
        }
    }

    _removePlayer(req, res, next) {
        try {
            req.group.removePlayer(req.player._id, req.params.playerId);
            next();
        } catch (error) {
            res.json(404, { code: 404, message: error, resp: null });
        }
    }

    _makeAdminPlayer(req, res, next) {
        try {
            req.group.makeAdmin(req.player._id, req.body.playerId);
            next();
        } catch (error) {
            res.json(404, { code: 404, message: error, resp: null });
        }
    }

    _deleteGroup(req, res, next) {
        repoGroup.delete(req.group)
            .then((resp) => {
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

    _checkPlayerMember(req, res, next) {
        if (req.group.isMember(req.player._id))
            next();
        else
            res.json(400, { code: 400, message: 'El player no es miembro del group.', resp: null });
    }

    _checkPlayerAdmin(req, res, next) {
        if (req.group.isAdmin(req.player._id))
            next();
        else
            res.json(400, { code: 400, message: 'El player no es admin.', resp: null });
    }

    _checkPlayerFriends(req, res, next) {
        repoFriendship.getByPlayerId(req.player._id)
            .then((resp) => {
                let notFriends = [];

                for (let i = 0; i < req.body.players.length; i++) {
                    if (!this._isFriend(req.body.players[i], resp.resp))
                        notFriends.push(req.body.players[i]._id);
                }

                if (notFriends.length > 0)
                    res.json(404, { code: 404, message: 'There are player who are not your friends, they must accept your friendship request before you can invite them.', resp: notFriends });
                else
                    next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _updateGroup(req, res, next) {
        req.group.description = req.body.description || req.group.description;
        req.group.photo = req.body.photo || req.group.photo;
        req.group.auditInfo.modifiedBy = req.player._id; //We should store deviceId here
        req.group.auditInfo.modifiedOn = new Date();
        req.group.auditInfo.modifiedFrom = req.body.platform;

        repoGroup.update(req.group)
            .then((resp) => {
                return repoGroup.get(resp.resp._id);
            })
            .then((resp) => {
                req.group = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _auditGroup(req, res, next) {
        req.group.auditInfo.modifiedBy = req.player._id; //We should store deviceId here
        req.group.auditInfo.modifiedOn = new Date();
        req.group.auditInfo.modifiedFrom = 'MOBILE_APP';

        repoGroup.update(req.group)
            .then((resp) => {
                req.group = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _fillGroupsInfo(req, res, next) {
        let promises = [];
        for (let i = 0; i < req.groups.length; i++) {
            promises.push(this._fillGroupInfo(req.groups[i])
                .then((group) => {
                    group.auditInfo = undefined;
                    return group;
                })
            );
        }

        Promise.all(promises)
            .then((groups) => {
                req.groups = groups;
                next();
            });
    }

    _exitFromGroup(req, res, next) {
        req.group.removePlayer(req.player._id, req.player._id);

        req.group.auditInfo.modifiedBy = req.player._id; //We should store deviceId here
        req.group.auditInfo.modifiedOn = new Date();
        req.group.auditInfo.modifiedFrom = 'MOBILE_APP';

        repoGroup.update(req.group)
            .then((resp) => {
                return repoGroup.get(resp.resp._id);
            })
            .then((resp) => {
                req.group = resp.resp;
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _sendMessage(req, res, next) {
        req.messageSent = req.group.addMessage(req.player._id, req.body.message, new Date());
        repoGroup.update(req.group)
            .then((resp) => {
                let ids = req.group.players.map(p => { return p; });
                return this._getUserIds(ids);
            })
            .then(userIds => {
                this._sendMessageToWebsocket(userIds, req.params.id, req.messageSent);
                next();
            }, (cause) => {
                res.json(404, { code: 404, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _fillGroupInfo(group) {
        return new Promise((resolve, reject) => {
            let promises = [];

            group.players.forEach((p) => {

                promises.push(
                    repoPlayer.get(p)
                        .then((resp) => {
                            return resp.resp;
                        })
                );
            });

            Promise.all(promises)
                .then((allPlayers) => {
                    for (let i = 0; i < group.players.length; i++) {
                        let fullPlayer = allPlayers.find((p) => { return p._id === group.players[i] });
                        group.players[i] = fullPlayer;
                    }

                    for (let i = 0; i < group.admins.length; i++) {
                        let fullPlayer = allPlayers.find((p) => { return p._id === group.admins[i] });
                        group.admins[i] = fullPlayer;
                    }

                    resolve(group);
                });
        });
    }

    _isFriend(id, friends) {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].friendId == id)
                return true;
        }
        return false;
    }

    _sendMessageToWebsocket(ids, groupId, message) {
        let body = {
            ids,
            data: {
                groupId,
                message,
                type: 'GROUP'
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

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = GroupRoutes;