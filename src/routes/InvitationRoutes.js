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
        server.get('/invitation/:id', (req, res, next) => { });
        server.post('/invitation/:id/accept', (req, res, next) => { });
        server.post('/invitation/:id/reject', (req, res, next) => { });
        server.post('/invitation',
            this._bodyIsNotNull,
            this._validateMatch,
            this._validateSender,
            this._validateRecipient,
            this._createInvitation,
            this._insertInvitation);
        server.del('/invitation/:id', (req, res, next) => { });
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
                req.body.createdOn);
            next();
        } catch (error) {
            res.json(error.code, { code: error.code, message: error.message, resp: null });
        }
    }

    _insertInvitation(req, res, next) {
        invitationRepo.add(req.invitation)
            .then((response) => {
                this._sendNotification(response.resp);
                res.json(200, { code: 200, message: 'OK', resp: response.resp });
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
                    res.json(400, { code: 400, message: 'Match inválido', resp: null });
                } else {
                    if (req.user._id != response.resp.userid) {
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
                    res.json(400, { code: 400, message: 'Match inválido', resp: null });
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

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }

    static get INVALID_BODY() {
        return 'Invalid request body';
    }
}

module.exports = InvitationRoutes;