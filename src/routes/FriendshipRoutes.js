let Routes = require('../common/Routes');
let fetch = require('request');

class FriendshipRoutes extends Routes {
    _addAllRoutes(server) {
        server.get('/friendship/:id', this._redirect);
        server.get('/friendship', this._redirect);
        server.put('/friendship', this._redirect);
        server.del('/friendship/:id', this._redirect);
    }

    _redirect(req, res, next) {
        fetch({
            headers: {
                authorization: req.headers.authorization
            },
            url: 'http://localhost:8094' + req.url,
            method: req.method,
            body: JSON.parse(JSON.stringify(req.body)),
            json: true
        }, (err, response, data) => {
            if (err) {
                res.json(500, { code: 500, message: err.message, resp: err });
            } else {
                res.json(response.statusCode, response.body);
            }
        });
    }
}

module.exports = FriendshipRoutes;