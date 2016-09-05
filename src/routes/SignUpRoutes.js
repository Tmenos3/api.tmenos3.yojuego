var Routes = require('./Routes');
var config = require('../../config');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var Player = require('../models/Player');
var jwt = require('jsonwebtoken');
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
        server.post('/signUp/local', this._signUpLocal, this._createPlayerLocal, this._generateToken);
        server.post('/signUp/facebook', (req, res, next) => { });
        server.post('/signUp/google', (req, res, next) => { });
    }

    _signUpLocal(req, res, next) {
        let mail = req.params.email;

        repo.getBy({ "account.mail": mail })
            .then((result) => {
                let existe = false;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.mail == mail) {
                        existe = true;
                    }
                }

                // //if (result.length > 0) {
                if (existe) {
                    res.json(400, 'La cuenta está en uso');
                } else {
                    next();
                }
            }, (err) => { res.json(400, err); })
            .catch((err) => { res.json(500, err); });
    }

    _createPlayerLocal(req, res, next) {
        var newPlayer = new Player(req.params.nickName, new Date(req.params.birthDate), req.params.state, req.params.adminState);
        newPlayer.account = {
            type: 'local',
            mail: req.params.email,
            password: req.params.password
        };

        repo.add(newPlayer)
            .then((resp) => {
                req.info = { 
                    id: resp.resp._id, 
                    player: newPlayer 
                };
                next();
            }, (err) => { res.json(400, err); });
    }

    _generateToken(req, res, next) {
        var token = jwt.sign(req.info.id, config.secret);
        res.json(200, { token: token, player: req.info.player });
        next();
    }

    // _signUpLocal(req, res, next) {
    //     let mail = req.params.email;
    //     let password = req.params.password;
    //     let nickName = req.params.nickName;
    //     let birthDate = req.params.birthDate;
    //     let state = req.params.state;
    //     let adminState = req.params.adminState;

    //     //No me está funcionando el filtrado y me trae todos
    //     //Debería guardar el token junto con el player?
    //     //En algunos lados he leido que no es necesario, en otros si

    //     // client.search({
    //     //     index: 'app',
    //     //     type: 'player',
    //     //     query: {
    //     //         "nickName": 'facundoiohabsd'
    //     //     }
    //     // }, (error, response, status) => {
    //     //     if (error) {
    //     //         //reject(ESRepository.UNEXPECTED_ERROR);
    //     //     }
    //     //     else {
    //     //         //resolve(response.hits.hits);
    //     //     }
    //     // });

    //     repo.getBy({ "account.mail": mail })
    //         .then((result) => {
    //             var existe = false;
    //             //Esta basura la estoy haciendo porque no me funca el filtro
    //             //lo tengo que solucionar
    //             for (let i = 0; i < result.length; i++) {
    //                 if (result[i]._source.account.mail == mail){
    //                     existe = true;
    //                 }
    //             }

    //             //if (result.length > 0) {
    //             if (existe) {
    //                 res.json(400, 'La cuenta está en uso');
    //             } else {
    //                 var newPlayer = new Player(nickName, new Date(birthDate), state, adminState);
    //                 newPlayer.account = {
    //                     type: 'local',
    //                     mail: mail,
    //                     password: password
    //                 };

    //                 repo.add(newPlayer)
    //                     .then((resp) => {
    //                         //res.json(200, { id: resp.resp._id, player: newPlayer });
    //                         //La idea es un mecanismo que genere el token y lo devuelva
    //                         //Es mas, estoy pensando en refactorizar esto para llamar varias veces el next...
    //                         next({ id: resp.resp._id, player: newPlayer }, res, next);

    //                     }, (err) => { res.json(400, err); });
    //             }
    //         }, (err) => { res.json(400, err); })
    //         .catch((err) => { res.json(500, err); });
    // }
}

module.exports = SignUpRoutes;