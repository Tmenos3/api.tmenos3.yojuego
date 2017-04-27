let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class PushNotification {
    constructor(type, info) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(PushNotification.INVALID_TYPE)));
        validator.addCondition(new NotNullOrUndefinedCondition(info).throw(new Error(PushNotification.INVALID_INFO)));

        validator.execute(() => {
            this.type = type;
            this.info = info;
        }, (err) => { throw err; });
    }

    static get INVALID_TYPE() {
        return 'Type must be defined and can not be null.';
    }

    static get INVALID_INFO() {
        return 'Info must be defined and can not be null.';
    }
}

module.exports = PushNotification;