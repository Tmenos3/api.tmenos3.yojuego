let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('../../common/Routes');

class ServiceRoutes extends Routes {
    constructor(friendshipManagerParam) {
        super();

        this._getAllFriendships = this._getAllFriendships.bind(this);
        this._createFriendship = this._createFriendship.bind(this);
        this._deleteFriendship = this._deleteFriendship.bind(this);
        this._get = this._get.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(friendshipManagerParam).throw(ServiceRoutes.INVALID_FRIENDSHIP_MANAGER));

        validator.execute(() => {
            this._friendshipManager = friendshipManagerParam;
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/friendship/:id', super._paramsIsNotNull, this._get);
        server.get('/friendship', this._getAllFriendships);
        server.put('/friendship', super._bodyIsNotNull, this._createFriendship);
        server.del('/friendship/:id', super._paramsIsNotNull, this._deleteFriendship);
    }

    _get(req, res, next) {
        this._friendshipManager.get(req.params.id, req.player._id)
            .then(friendship => {
                res.json(200, { code: 200, resp: friendship, message: null })
            }, cause => {
                res.json(200, cause);
            })
            .catch(error => {
                res.json(500, { code: 500, message: error.message, resp: error });
            });
    }

    _getAllFriendships(req, res, next) {
        this._friendshipManager.getAll(req.player._id)
            .then(friendships => {
                res.json(200, { code: 200, resp: friendships, message: null })
            }, cause => {
                res.json(200, cause);
            })
            .catch(error => {
                res.json(500, { code: 500, message: error.message, resp: error });
            });
    }

    _createFriendship(req, res, next) {
        this._friendshipManager.create(req.player._id, req.body.email)
            .then(friendship => {
                res.json(200, { code: 200, resp: friendship, message: null })
            }, cause => {
                res.json(200, cause);
            })
            .catch(error => {
                res.json(500, { code: 500, message: error.message, resp: error });
            });
    }

    _deleteFriendship(req, res, next) {
        this._friendshipManager.delete(req.params.id, req.player._id)
            .then(friendship => {
                res.json(200, { code: 200, resp: friendship, message: null })
            }, cause => {
                res.json(200, cause);
            })
            .catch(error => {
                res.json(500, { code: 500, message: error.message, resp: error });
            });
    }

    static get INVALID_FRIENDSHIP_MANAGER() {
        return 'El friendship manager no puede ser null ni undefined';
    }
}

module.exports = ServiceRoutes;
