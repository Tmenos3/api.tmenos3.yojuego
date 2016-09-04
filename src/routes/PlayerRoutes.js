import { Validator,
         NotNullOrUndefinedCondition } from 'no-if-validator';

class PlayerRoutes {
    constructor() { }

    add(server){
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(PlayerRoutes.INVALID_SERVER));

        validator.execute(() => this._addAllRoutes(server), (err) => { throw err; });
    }

    _addAllRoutes(server){
        server.get('/player', (req, res, next) => { });
        server.get('/player/getBy/:params', (req, res, next) => { });
        server.get('/player/:id', (req, res, next) => { });
        server.post('/player/create', (req, res, next) => { });
        server.post('/player/:id/update', (req, res, next) => { });
        server.delete('/player/:id', (req, res, next) => { });
    }

    static get INVALID_SERVER(){
        return 'El server no puede ser null ni undefined';
    }
}

module.exports = PlayerRoutes;