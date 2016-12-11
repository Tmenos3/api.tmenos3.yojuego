var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var CustomCondition = require('no-if-validator').CustomCondition;

class Device {
    constructor(deviceId, platform, userId, createdOn) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(deviceId).throw(new Error(Device.INVALID_DEVIDE_ID)));
        validator.addCondition(new NotNullOrUndefinedCondition(platform).throw(new Error(Device.INVALID_PLATFORM)));
        validator.addCondition(new NotNullOrUndefinedCondition(userId).throw(new Error(Device.INVALID_USERID)));
        validator.addCondition(new CustomCondition(() => {
            return platform && (platform == 'ios' || platform == 'android');
        }).throw(new Error(Device.INVALID_PLATFORM)));

        validator.execute(() => {
            this.deviceId = deviceId;
            this.platform = platform;
            this.userId = userId;
            this.createdOn = createdOn;
        }, (err) => { throw err; });
    }

    static get INVALID_DEVIDE_ID() {
        return 'Devide Id must be defined and can not be null.';
    }
    static get INVALID_PLATFORM() {
        return 'Platform must be defined and can not be null.';
    }

    static get INVALID_USERID() {
        return 'User Id must be defined and can not be null.';
    }
}

module.exports = Device;