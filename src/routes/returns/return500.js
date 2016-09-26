let ret = function (res, err, resp) {
    res.json(500, { code: 500, message: err, resp: resp });
};

module.exports = ret;