let Notification = require('./Notification');

class IOsNotification extends Notification {
  constructor(devices, data) {
    super('IOS', devices, data);

  }
}

module.exports = IOsNotification;