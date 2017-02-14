let UserESRepository = require('../repositories/UserESRepository');
let userRepo = null;

let getUser = (esClient, unless) => {
    userRepo = new UserESRepository(esClient);
    return (req, res, next) => {
        if (unless.indexOf(req.url) > -1)
            return next();

        userRepo.get(req.user.id)
            .then((response) => {
                if (!response.resp) {
                    res.json(404, { code: 404, message: 'User inexistente', resp: null });
                } else {
                    req.user = response.resp;
                    next();
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }
}

module.exports = getUser;