let ret = function (res, err, resp) {
    res.json(400, { code: 400, message: err, resp: resp });
};

module.exports = ret;