let Notification = require('./Notification');

class AndroidNotification extends Notification {
  constructor(devices, data) {
    super('ANDROID', devices, data);

  }
}

module.exports = AndroidNotification;