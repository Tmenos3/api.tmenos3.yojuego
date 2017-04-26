let gcm = require('android-gcm');
let gcmObject = new gcm.AndroidGcm('API_KEY');

class NotificationService {
    push(devices, notification) {
        let message = new gcm.Message({
            registration_ids: devices,
            data: notification
        });

        return new Promise((resolve, reject) => {
            gcmObject.send(message, (err, response) => {
                if (err) {
                    return reject({ code: 500, message: 'Unexpected error.', resp: err });
                } else {
                    return resolve({ code: 200, message: 'Notification sent', resp: response });
                }
            });
        });
    }
}

module.exports = NotificationService;