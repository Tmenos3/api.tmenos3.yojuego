let ret = function (res, err, resp) {
    res.json(200, { code: 200, message: err, resp: resp });
};

module.exports = ret;