let verifyClaims = () => {
  return (req, res, next) => {
    // if (req.user.rol !== 'master-admin' && req.user.rol !== 'service')
    //   res.json(400, { code: 401, message: 'Bad request.' });
    // else
      next();
  }
}

module.exports = {
  verifyClaims
}