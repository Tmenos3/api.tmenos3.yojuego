let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let ValidMailCondition = require('no-if-validator').ValidMailCondition;
let config = require('config');
// let UserESRepository = require('../repositories/UserESRepository');
let jwt = require('jsonwebtoken');
// let es = require('elasticsearch');
// let client = new es.Client({
//     host: config.get('dbConfig').database,
//     log: 'info'
// });

// let repo = new UserESRepository(client);

let getNewMail = (email) => {
    return {
        from: "facu.larocca@gmail.com",
        to: email,
        subject: "YoJuego! - Reestablecimiento de contraseña.",
        text: "Node.js New world for me"
        //Link: 'http://sarasa/setNewPassword/token=' + _getToken(req.email);
        //html: "<b>Node.js New world for me</b>"
    };
}

let getMailer = () => {
    let mailer = require("nodemailer");
    let smtpTransport = require('nodemailer-smtp-transport');

    let options = {
        // service: 'gmail',
        // secure: true,
        host: '2a00:1450:4010:c06::6d', // smtp.gmail.com IPv6
        port: 465,
        secure: true,
        tls: {
            rejectUnauthorized: false // IP address does not match hostname on cert
        },
        auth: {
            user: 'facu.larocca@gmail.com',
            pass: 'Starsp80'
        }
};

return mailer.createTransport(smtpTransport(options))
}

class ResetPasswordRoutes {
    constructor() { }

    add(server) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(ResetPasswordRoutes.INVALID_SERVER));

        validator.execute(() => this._addAllRoutes(server), (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/resetPassword', this._validateBody, this._validateEmail, this._sendEmail);
        server.post('/setNewPassword/:token', this._validateBody, this._validateNewPassword, this._saveNewPassword);
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

    _validateNewPassword(req, res, next) {

    }

    _sendEmail(req, res, next) {
        let mailer = getMailer();
        let mail = getNewMail(req.body.email);

        mailer.sendMail(mail, (error, response) => {
            if (error) {
                res.json(500, { code: 500, message: 'Mail could not be sent.', resp: error });
            } else {
                res.json(200, { code: 200, message: 'Mail has beed sent.', resp: null });
            }

            mailer.close();
        });
    }

    _saveNewPassword(req, res, next) {

    }

    _generateToken(email) {
        return jwt.sign(email, config.get('serverConfig').secret);
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
}

module.exports = ResetPasswordRoutes;