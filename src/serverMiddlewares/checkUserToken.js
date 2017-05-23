let checkUserToken = (unless) => {
    return (req, res, next) => {
        if (unless.indexOf(req.url.split('?')[0]) > -1)
            return next();

        if (req.headers.authorization.substring(7) != req.user.token)
            res.json(400, { code: 400, message: 'Session has expired.', resp: null });
        else
            next();
    }
}

module.exports = checkUserToken;