let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let CustomCondition = require('no-if-validator').CustomCondition;

class Device {
  constructor(userid, deviceid, type) {
    let validator = new Validator();
    validator.addCondition(new NotNullOrUndefinedCondition(userid).throw(new Error(Device.INVALID_USERID)));
    validator.addCondition(new NotNullOrUndefinedCondition(deviceid).throw(new Error(Device.INVALID_DEVICEID)));
    validator.addCondition(new NotNullOrUndefinedCondition(type).throw(new Error(Device.INVALID_TYPE)));
    validator.addCondition(new CustomCondition(() => { return type === 'ANDROID' || type === 'IOS' }).throw(new Error(Device.INVALID_TYPE)));

    validator.execute(() => {
      this.userid = userid;
      this.deviceid = deviceid;
      this.type = type;
    }, (err) => { throw err; });
  }

  static get INVALID_USERID() {
    return 'El USER_ID es obligatorio.';
  }
  static get INVALID_DEVICEID() {
    return 'El DEVICE_ID es obligatorio.';
  }
  static get INVALID_TYPE() {
    return 'El TYPE es obligatorio y debe ser ANDROID o IOS.';
  }
}

module.exports = Device;