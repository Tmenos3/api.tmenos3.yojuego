var Routes = require('./Routes');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Invitation = require('../models/Invitation');
var invitationRepo = null;
var InvitationESRepository = require('../repositories/InvitationESRepository');
var MatchESRepository = require('../repositories/MatchESRepository');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var NotificationService = require('../models/notification/NotificationService');
var noticationService = null;
var invitationRepo = null;
var matchRepo = null;
var playerRepo = null;

class InvitationRoutes extends Routes {
    constructor(esClient) {
        super();

        this._bodyIsNotNull = this._bodyIsNotNull.bind(this);
        this._createInvitation = this._createInvitation.bind(this);
        this._insertInvitation = this._insertInvitation.bind(this);
        this._sendNotification = this._sendNotification.bind(this);
        this._validateMatch = this._validateMatch.bind(this);
        this._validateSender = this._validateSender.bind(this);
        this._validateRecipient = this._validateRecipient.bind(this);
        this._updateMatch = this._updateMatch.bind(this);
        this._returnInvitation = this._returnInvitation.bind(this);
        this._paramsIsNotNull = this._paramsIsNotNull.bind(this);
        this._validateInvitation = this._validateInvitation.bind(this);
        this._validateRecipientInvitation = this._validateRecipientInvitation.bind(this);
        this._acceptInvitation = this._acceptInvitation.bind(this);
        this._rejectInvitation = this._rejectInvitation.bind(this);
        this._updateInvitation = this._updateInvitation.bind(this);
        this._addPlayerToMatch = this._addPlayerToMatch.bind(this);
        this._removePlayerFromPending = this._removePlayerFromPending.bind(this);
        this._confirmPlayerToMatch = this._confirmPlayerToMatch.bind(this);
        this._getMatch = this._getMatch.bind(this);

        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(InvitationRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            invitationRepo = new InvitationESRepository(esClient);
            matchRepo = new MatchESRepository(esClient);
            playerRepo = new PlayerESRepository(esClient);
            noticationService = new NotificationService();
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/invitation/:id', this._paramsIsNotNull, this._returnInvitation);
        server.post('/invitation/:id/accept',
            this._paramsIsNotNull,
            this._validateInvitation,
            this._validateRecipientInvitation,
            this._acceptInvitation,
            this._getMatch,
            this._confirmPlayerToMatch,
            this._updateInvitation,
            this._updateMatch);
        server.post('/invitation/:id/reject',
            this._paramsIsNotNull,
            this._validateInvitation,
            this._validateRecipientInvitation,
            this._rejectInvitation,
            this._getMatch,
            this._removePlayerFromPending,
            this._updateInvitation,
            this._updateMatch);
        server.post('/invitation',
            this._bodyIsNotNull,
            this._validateMatch,
            this._validateSender,
            this._validateRecipient,
            this._createInvitation,
            this._insertInvitation,
            this._addPlayerToMatch,
            this._updateMatch);
        server.del('/invitation/:id', (req, res, next) => { });
    }

    _paramsIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.params).throw(InvitationRoutes.INVALID_PARAMS));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err, resp: null }); });
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(InvitationRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _createInvitation(req, res, next) {
        try {
            req.invitation = new Invitation(req.body.senderId,
                req.body.recipientId,
                req.body.matchId,
                new Date(),
                'pending');
            next();
        } catch (error) {
            res.json(error.code, { code: error.code, message: error.message, resp: null });
        }
    }

    _insertInvitation(req, res, next) {
        invitationRepo.add(req.invitation)
            .then((response) => {
                //this._sendNotification(response.resp);
                req.invitation = response.resp;
                next();
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _sendNotification(invitation) {
        notificationService.send(invitation);
    }

    _validateMatch(req, res, next) {
        matchRepo.get(req.body.matchId)
            .then((response) => {
                if (response.code == 404) {
                    res.json(400, { code: 400, message: 'Match inválido', resp: null });
                } else {
                    req.match = response.resp;
                    next();
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _validateSender(req, res, next) {
        playerRepo.get(req.body.senderId)
            .then((response) => {
                if (response.code == 404) {
                    res.json(400, { code: 400, message: 'Sender inválido', resp: null });
                } else {
                    if (req.user.id != response.resp.userid) {
                        res.json(400, { code: 400, message: 'Sender inválido', resp: null });
                    } else {
                        next();
                    }
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _validateRecipient(req, res, next) {
        playerRepo.get(req.body.recipientId)
            .then((response) => {
                if (response.code == 404) {
                    res.json(400, { code: 400, message: 'Recipient inválido', resp: null });
                } else {
                    next();
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _addPlayerToMatch(req, res, next) {
        req.match.addInvitedPlayer(req.body.recipientId);
        next();
    }

    _updateMatch(req, res, next) {
        matchRepo.update(req.match)
            .then((response) => {
                res.json(200, { code: 200, message: 'OK', resp: req.invitation });
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _returnInvitation(req, res, next) {
        invitationRepo.get(req.params.id)
            .then((response) => {
                if (!response.resp) {
                    res.json(401, { code: 401, message: 'Invitation does not exist', resp: null });
                } else {
                    res.json(200, { code: 200, message: null, resp: response.resp });
                }
            }, (err) => res.json(400, { code: 400, message: err.message, resp: null }))
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    _validateInvitation(req, res, next) {
        invitationRepo.get(req.params.id)
            .then((response) => {
                if (!response.resp) {
                    res.json(401, { code: 401, message: 'Invitation does not exist', resp: null });
                } else if (response.resp.state != 'pending') {
                    res.json(401, { code: 401, message: 'Invitation is not pending', resp: null });
                } else {
                    req.invitation = response.resp;
                    next();
                }
            }, (err) => res.json(400, { code: 400, message: err.message, resp: null }))
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    _validateRecipientInvitation(req, res, next) {
        playerRepo.getByUserId(req.user.id)
            .then((response) => {
                if (req.invitation.recipientId != response.resp._id) {
                    res.json(400, { code: 400, message: 'Solo el receptor de la invitacion puede aceptarla o cancelarla.', resp: null });
                } else {
                    next();
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    _acceptInvitation(req, res, next) {
        req.invitation.accept();
        next();
    }

    _rejectInvitation(req, res, next) {
        req.invitation.reject();
        next();
    }

    _updateInvitation(req, res, next) {
        invitationRepo.update(req.invitation)
            .then((response) => {
                next();
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _getMatch(req, res, next) {
        matchRepo.get(req.invitation.matchId)
            .then((response) => {
                if (response.code == 404) {
                    res.json(400, { code: 400, message: 'Match inválido', resp: null });
                } else {
                    req.match = response.resp;
                    next();
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _confirmPlayerToMatch(req, res, next) {
        req.match.addConfirmPlayer(req.invitation.recipientId);
        //this._sendNotification(invitation);
        next();
    }

    _removePlayerFromPending(req, res, next) {
        req.match.removeInvitedPlayer(req.invitation.recipientId);
        //this._sendNotification(invitation);
        next();
    }

    static get INVALID_BODY() {
        return 'Invalid request body';
    }

    static get INVALID_PARAMS() {
        return 'Invalid request params';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = InvitationRoutes;