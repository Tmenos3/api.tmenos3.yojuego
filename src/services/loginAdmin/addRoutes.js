let jwt = require('jsonwebtoken');

module.exports = (server, config) => {
  server.post('/admin/login', (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.rol) {
      res.json(401, { code: 401, message: 'Unauthorized' });
    }
    else {
      let user = config.adminCredentials.find(u => { return u.password === req.body.password && u.username === req.body.username });
      if (!user) {
        res.json(401, { code: 401, message: 'Unauthorized' });
      }
      else {
        let claims = {
          username: req.body.username,
          rol: req.body.rol
        };
        let token = jwt.sign(claims, config.get('serverConfig').secret, { expiresIn: 600 });
        res.json(200, { code: 200, message: 'Authorized', response: { token } });
      }
    }
  });
}