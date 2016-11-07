let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var config = require('config');
var fetch = require('node-fetch');

var jwt = null;

class ServerRoute extends Routes {
    constructor(jwtParam) {
        super();
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(ServerRoute.INVALID_JWT));
        validator.execute(() => {
            jwt = jwtParam;
        }, (err) => { throw err; });

        this._checkESStatatus = this._checkESStatatus.bind(this);
        this._authorizeRequest = this._authorizeRequest.bind(this);
        this._verifyClaims = this._verifyClaims.bind(this);
    }

    _addAllRoutes(server) {
        server.get('/status',
            this._authorizeRequest,
            this._verifyClaims,
            this._checkESStatatus
        );
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
        jwt.verify(req.params.token, config.get('serverConfig').secret, (err, decoded) => {
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
