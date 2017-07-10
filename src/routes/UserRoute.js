let Routes = require('./Routes');
let fetch = require('request');

class UserRoute extends Routes {
    constructor(esClient) {
        super();
    }

    _addAllRoutes(server) {
        server.put('/user/device/:type', super._paramsIsNotNull, super._bodyIsNotNull, this._registerDevice);
        server.post('/user/device/:type', super._paramsIsNotNull, super._bodyIsNotNull, this._updateDevice);
    }

    _registerDevice(req, res, next) {
        let body = {
            userid: req.user._id,
            deviceid: req.body.deviceid,
            type: req.params.type
        }

        fetch({
            url: 'http://localhost:8093/notification/register',
            method: 'PUT',
            json: body
        },
            (err, reponse, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (reponse.statusCode !== 200) {
                    res.json(reponse.statusCode, { code: reponse.statusCode, message: 'Something went wrong registering device.', resp: null });
                } else {
                    res.json(200, { code: 200, message: 'The device has been registered', resp: null });
                }
            });
    }

    _updateDevice(req, res, next) {
        let body = {
            userid: req.user._id,
            olddeviceid: req.body.olddeviceid,
            newdeviceid: req.body.newdeviceid,
            type: req.params.type
        }

        fetch({
            url: 'http://localhost:8093/notification/update--',
            method: 'PUT',
            json: body
        },
            (err, reponse, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (reponse.statusCode !== 200) {
                    res.json(reponse.statusCode, { code: reponse.statusCode, message: 'Something went wrong updating device.', resp: null });
                } else {
                    res.json(200, { code: 200, message: 'The device has been updated', resp: null });
                }
            });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = UserRoute;
