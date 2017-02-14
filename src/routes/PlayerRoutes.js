let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let PlayerESRepository = require('../repositories/PlayerESRepository');
let Player = require('../models/Player');
let repo = null;

class PlayerRoutes extends Routes {
    constructor(esClient) {
        super();

        this._getPlayer = this._getPlayer.bind(this);
        this._update = this._update.bind(this);
        this._create = this._create.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(PlayerRoutes.INVALID_ES_CLIENT));
        validator.execute(() => {
            repo = new PlayerESRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/player', this._getPlayer); // revisar
        server.put('/player/create', super._bodyIsNotNull, this._create);
        server.post('/player/:id/update', super._paramsIsNotNull, super._bodyIsNotNull, this._update);
    }

    _create(req, res, next) {
        repo.getByUserId(req.user._id)
            .then((ret) => {
                if (ret.resp) {
                    res.json(400, { code: 400, message: 'Player already exists', resp: null });
                } else {
                    try {
                        let email = null;
                        if (req.user.type == 'yojuego')
                            email = req.user.id;

                        let player = new Player(req.body.firstName, req.body.lastName, req.body.nickName, req.user._id, email, 'photo', 'phone');
                        player.playerAudit = {
                            createdBy: req.body.platform || 'MOBILE_APP', //We should store deviceId here
                            createdOn: new Date(),
                            createdFrom: req.body.platform || 'MOBILE_APP',
                            modifiedBy: null,
                            modifiedOn: null,
                            modifiedFrom: null
                        }

                        return repo.add(player);
                    } catch (error) {
                        res.json(400, { code: 400, message: error.message, resp: error });
                    }
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .then((resp) => {
                res.json(200, { code: 200, message: 'Player created.', resp: resp.resp });
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _getPlayer(req, res, next) {
        res.json(200, { code: 200, message: 'OK', resp: req.player });
    }

    _update(req, res, next) {
        req.player.firstName = req.body.firstName;
        req.player.lastName = req.body.lastName;
        req.player.nickName = req.body.nickName;
        req.player.playerAudit.modifiedBy = req.body.platform || 'MOBILE_APP';
        req.player.playerAudit.modifiedOn = new Date();
        req.player.playerAudit.modifiedFrom = req.body.platform || 'MOBILE_APP';

        repo.update(req.player)
            .then((resp) => {
                res.json(200, { code: 200, message: 'Profile saved.', resp: resp.resp });
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });

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

module.exports = PlayerRoutes;