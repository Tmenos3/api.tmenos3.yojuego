let gcm = require('android-gcm');
let gcmObject = new gcm.AndroidGcm('API_KEY');

class NotificationService {
    constructor() {
        this.notify = this.notify.bind(this);
    }

    notify(notification) {
        let message = new gcm.Message({
            registration_ids: ['DEVICE_ID'],
            data: {
                key1: 'key 1',
                key2: 'key 2'
            }
        });

        gcmObject.send(message, function (err, response) { 
            console.log(err);
            console.log(response);
        });
    }
}

module.exports = NotificationService;