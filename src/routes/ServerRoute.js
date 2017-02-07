let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let config = require('config');
let fetch = require('node-fetch');
let setup = require('../setup/setup');

let _jwt = null;
let _esClient = null;

class ServerRoute extends Routes {
    constructor(esClient, jwtParam) {
        super();

        this._checkESStatatus = this._checkESStatatus.bind(this);
        this._authorizeRequest = this._authorizeRequest.bind(this);
        this._verifyClaims = this._verifyClaims.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(ServerRoute.INVALID_JWT));
        validator.execute(() => {
            _jwt = jwtParam;
            _esClient = esClient;
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/status', this._authorizeRequest, this._verifyClaims, this._checkESStatatus);
        server.get('/setup', (req, res, next) => {
            setup(_esClient)
                .then((resp) => {
                    res.json(200, { 'status': 'ok', 'info': resp });
                }, (cause) => {
                    res.json(400, { 'error': cause });
                })
                .catch((error) => {
                    res.json(500, { 'error': error });
                });
        });
    }

    _checkESStatatus(req, res, next) {
        fetch(config.get('dbConfig').database + '_cluster/health')
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
        _jwt.verify(req.params.token, config.get('serverConfig').secret, (err, decoded) => {
            if (err) {
                res.json(401, { code: 401, message: err, resp: null });
            } else {
                if (req.params.key == decoded.key && req.params.password == decoded.password) {
                    req.claims = decoded.claims
                    next();
                } else {
                    res.json(401, { code: 401, message: err, resp: null });
                }
            }
        });
    }

    _verifyClaims(req, res, next) {
        if (req.claims.databaseAdmin) {
            next();
        } else {
            res.json(401, { code: 401, message: err, resp: null });
        }
    }

    static get INVALID_JWT() {
        return 'El jwt no puede ser null ni undefined';
    }
}

module.exports = ServerRoute;
