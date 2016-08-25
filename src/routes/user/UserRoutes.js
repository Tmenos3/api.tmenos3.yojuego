var config = require('../../../config');
var jwt = require('jsonwebtoken');
var UserMap = require('../../models/mappings/UserMap');
var PlayerMap = require('../../models/mappings/PlayerMap');
var MatchMap = require('../../models/mappings/MatchMap');
var ApiService = require('../../services/ApiService');
var apiService = new ApiService(UserMap, PlayerMap, MatchMap);

var UserRoutes = {
  setRoutes: function(server){
    server.post('/login', function(req, res, cb) {
      /*
       Dudas: 
          1- Donde debo validar la obligatoriedad de los paramentros?
          2- De quien es la responsabilidad de devoler armar el objeto que se devuelve?
          3- De quien es la responsabilidad de generar el token?
          4- Hay que definir un formato para el retorno? Ejemplo: {status: true, payload{...}}
      */
        apiService.login(req)
        .then((ret) => {
            var token = jwt.sign({id: ret.id}, config.secret, { expiresIn: config.expiresIn });
            res.json({status: true, token: token, player: JSON.stringify(ret.player)});
            return cb();
        }, (ret) => {
            res.json(ret);
            return cb(); 
        })
        .catch((err) => { 
            res.json(err);
            return cb(); 
        });
      });

    server.post('/signUp', function(req, res, cb) {
        apiService.signUp(req)
        .then((ret) => {
            var token = jwt.sign({id: ret.id}, config.secret, { expiresIn: config.expiresIn });
            res.json({status: true, token: token, player: JSON.stringify(ret.player)});
            return cb();
        }, (ret) => { 
            res.json(ret);
            return cb(); 
        })
        .catch((err) => { 
            res.json(err);
            return cb(); 
        });
      });
  }
};

module.exports = UserRoutes;