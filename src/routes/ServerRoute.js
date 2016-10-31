var Routes = require('./Routes');
var config = require('config');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var fetch = require('node-fetch');
var Config = require('../../config');
class ServerRoute extends Routes {
    constructor(esClient) {
        super();
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(ServerRoute.INVALID_ES_CLIENT));
        this.client = esClient;
        this._checkESStatatus = this._checkESStatatus.bind(this);
    }

    _addAllRoutes(server) {
        server.get('/status',
            this._authorizeRequest,
            this._checkESStatatus
        );
    }

    _checkESStatatus(req, res, next) {
        fetch(Config.database + '_cluster/health')
            .then((response) => {
                if (response.ok) {
                    return response.json()
                        .then((status) => {
                            res.json(200, { 'status': 'ok', 'info': status });
                        });
                }
                return response.json()
                    .then((error) => {
                        res.json(500, { 'status': 'error', 'info': error });
                    });
            })
            .catch((error) => {
                res.json(500, { 'error': error });
            })
    }

    _authorizeRequest(req, res, next) {
        //TODO: autorizar request con un token y con un claim especifico
        next();
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = ServerRoute;
