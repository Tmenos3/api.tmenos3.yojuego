let ret = function (res, err, resp) {
    res.json(404, { code: 404, message: err, resp: resp });
};

module.exports = ret;