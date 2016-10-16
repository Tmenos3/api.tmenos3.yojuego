let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let ValidMailCondition = require('no-if-validator').ValidMailCondition;
let CustomCondition = require('no-if-validator').CustomCondition;
let EqualCondition = require('no-if-validator').EqualCondition;
let config = require('config');
let UserESRepository = require('../repositories/UserESRepository');
let jwt = require('jsonwebtoken');
let es = require('elasticsearch');
let client = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});

let repo = new UserESRepository(client);

let generateToken = (email) => {
    return jwt.sign({ email: email }, config.get('serverConfig').secret);
}

let getNewMail = (email) => {
    let url = "http://localhost:8080/enterNewPassword/" + generateToken(email);
    let mailText = "<p>Para recuperar su contraseña por favor ingrese <a href=" + url + ">aqui</a>.</p>";

    return {
        from: "facu.larocca@gmail.com",
        to: email,
        subject: "YoJuego! - Reestablecimiento de contraseña.",
        html: mailText
    };
}

let getMailer = () => {
    let mailer = require("nodemailer");
    let smtpTransport = require('nodemailer-smtp-transport');

    let options = {
        service: 'gmail',
        secure: true,
        auth: {
            user: 'facu.larocca@gmail.com',
            pass: 'Starsp80'
        }
    };

    return mailer.createTransport(smtpTransport(options));
};

class ResetPasswordRoutes {
    constructor() { }

    add(server) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(ResetPasswordRoutes.INVALID_SERVER));

        validator.execute(() => this._addAllRoutes(server), (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/resetPassword', this._validateBody, this._validateEmail, this._sendEmail);
        server.post('/setNewPassword/:token', this._validateBody, this._validateToken, this._validateNewPassword, this._saveNewPassword);
    }

    _validateBody(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(ResetPasswordRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err, resp: null }); });
    }

    _validateEmail(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.email).throw(ResetPasswordRoutes.INVALID_MAIL));
        validator.addCondition(new ValidMailCondition(req.body.email).throw(ResetPasswordRoutes.INVALID_MAIL));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err, resp: null }); });
    }

    _validateToken(req, res, next) {
        jwt.verify(req.params.token, config.get('serverConfig').secret, (err, decoded) => {
            if (err) {
                res.json(401, { code: 401, message: err, resp: null });
            } else {
                req.user = {
                    email: decoded.email
                }

                next();
            }
        });
    }

    _validateNewPassword(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.newPassword).throw(ResetPasswordRoutes.INVALID_PÄSSWORD));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.repeatedPassword).throw(ResetPasswordRoutes.INVALID_REPEATED_PÄSSWORD));
        validator.addCondition(new EqualCondition(req.body.newPassword, req.body.repeatedPassword).throw(ResetPasswordRoutes.PASSWORDS_DONOT_MATCH));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err, resp: null }); });
    }

    _sendEmail(req, res, next) {
        repo.getByIdAndType(req.body.email, 'yojuego')
            .then((response) => {
                if (!response.resp) {
                    res.json(400, { code: 400, message: 'EMail incorrecto.', resp: null });
                } else {
                    let mailer = getMailer();
                    let mail = getNewMail(req.body.email);

                    mailer.sendMail(mail, (error, response) => {
                        if (error) {
                            res.json(500, { code: 500, message: 'Mail could not be sent.', resp: error });
                        } else {
                            res.json(200, { code: 200, message: 'Mail has been sent.', resp: null });
                        }

                        mailer.close();
                    });
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _saveNewPassword(req, res, next) {
        repo.getByIdAndType(req.user.email, 'yojuego')
            .then((response) => {
                if (!response.resp) {
                    res.json(400, { code: 400, message: "La cuenta de mail no existe", resp: null });
                } else {
                    let user = response.resp;
                    user.password = req.body.newPassword;
                    return repo.update(user);
                }
            }, (err) => res.json(400, { code: 400, message: "El cambio de contraseña no pudo ser realizado", resp: err }))
            .then((response) => res.json(200, { code: 200, message: "Password has been changed", resp: null }),
            (err) => res.json(400, { code: 400, message: "El cambio de contraseña no pudo ser realizado", resp: err }))
            .catch((err) => {
                res.json(500, { code: 500, message: "Euexpected error", resp: err });
            });
    }

    static get INVALID_SERVER() {
        return 'El server no puede ser null ni undefined.';
    }

    static get INVALID_BODY() {
        return 'El body no puede ser null.';
    }

    static get INVALID_MAIL() {
        return 'Mail informado inválido.';
    }

    static get INVALID_PÄSSWORD() {
        return "Invalid password";
    }

    static get INVALID_REPEATED_PÄSSWORD() {
        return "Invalid repeated password";
    }

    static get PASSWORDS_DONOT_MATCH() {
        return "Las password no son iguales";
    }
}

module.exports = ResetPasswordRoutes;