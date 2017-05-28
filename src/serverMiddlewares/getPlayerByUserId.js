let PlayerESRepository = require('../repositories/PlayerESRepository');
let playerRepo = null;

let getPlayerByUserId = (esClient, unless) => {
    playerRepo = new PlayerESRepository(esClient);
    return (req, res, next) => {
        if (unless.indexOf(req.url.split('?')[0]) > -1)
            return next();

        playerRepo.getByUserId(req.user._id)
            .then((response) => {
                if (!response.resp) {
                    res.json(404, { code: 404, message: 'Player inexistente', resp: null });
                } else {
                    req.player = response.resp;
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

module.exports = getPlayerByUserId;