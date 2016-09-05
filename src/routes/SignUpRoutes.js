var Routes = require('./Routes');
var config = require('../../config');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var Player = require('../models/Player');
var es = require('elasticsearch');
var client = new es.Client({
    host: config.database,
    log: 'info'
});
var repo = new PlayerESRepository(client);

class SignUpRoutes extends Routes {
    constructor() {
        super();
    }

    _addAllRoutes(server) {
        server.get('/signUp/facebook/callback', (req, res, next) => { });
        server.get('/signUp/google/callback', (req, res, next) => { });
        server.post('/signUp/local', this._signUpLocal);
        server.post('/signUp/facebook', (req, res, next) => { });
        server.post('/signUp/google', (req, res, next) => { });
    }

    _signUpLocal(req, res, next) {
        let mail = req.params.email;
        let password = req.params.password;
        let nickName = req.params.nickName;
        let birthDate = req.params.birthDate;
        let state = req.params.state;
        let adminState = req.params.adminState;

        client.search({
            index: 'app',
            type: 'player',
            query: {
                "nickName": 'facundoiohabsd'
            }
        }, (error, response, status) => {
            if (error) {
                //reject(ESRepository.UNEXPECTED_ERROR);
            }
            else {
                //resolve(response.hits.hits);
            }
        });

        // repo.getBy({ "account.mail": mail })
        //     .then((result) => {
        //         if (result.length > 0) {
        //             res.json(400, 'La cuenta está en uso');
        //         } else {
        //             var newPlayer = new Player(nickName, new Date(birthDate), state, adminState);
        //             newPlayer.account = {
        //                 type: 'local',
        //                 mail: mail,
        //                 password: password
        //             };

        //             repo.add(newPlayer)
        //                 .then((resp) => {
        //                     res.json(200, { id: resp.resp._id, player: newPlayer })
        //                 }, (err) => { res.json(400, err); });
        //         }
        //     }, (err) => { res.json(400, err); })
        //     .catch((err) => { res.json(500, err); });
    }

    static get INVALID_PASSPORT() {
        return 'Invalid Passport';
    }
}

module.exports = SignUpRoutes;