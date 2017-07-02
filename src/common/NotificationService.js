let fetch = require('request');

class NotificationService {
    send(userids, data) {
        return new Promise((resolve, reject) => {
            fetch({
                url: 'http://localhost:8093/notification/push',
                method: 'PUT',
                json: { userids, data }
            }, (err, res, data) => {
                    if (err) {
                        return reject({ code: 500, message: 'Error sending notification', resp: err });
                    } else if (res.statusCode !== 200) {
                        return reject({ code: res.statusCode, message: 'Error sending notification', resp: res });
                    } else {
                        return resolve({ code: 200, message: 'Notification sent.', resp: res });
                    }
                });
        });
    }
}

module.exports = NotificationService;