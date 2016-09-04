import Routes from './Routes';

class SignUpRoutes extends Routes{
    constructor() { 
        super(); 
    }

    _addAllRoutes(server){
        server.get('/signUp/facebook/callback', (req, res, next) => { });
        server.get('/signUp/google/callback', (req, res, next) => { });
        server.post('/signUp/local', (req, res, next) => { });
        server.post('/signUp/facebook', (req, res, next) => { });
        server.post('/signUp/google', (req, res, next) => { });
    }
}

module.exports = SignUpRoutes;