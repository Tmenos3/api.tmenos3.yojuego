let AndroidGcm = require('android-gcm').AndroidGcm;
let GsmMessage = require('android-gcm').Message;
let Notification = require('../models/Notification');

class NotificationService {
    constructor(config) {
        this.gcmSender = new AndroidGcm(config.android.API_KEY);
    }

    push(notification) {
        switch (notification.target) {
            case 'ANDROID':
                return this._pushAndroid(notification.devices, notification.data);
            case 'IOS':
                return this._pushIOs(notification.devices, notification.data);
        }
    }

    _pushAndroid(devices, data) {
        let message = new GsmMessage({
            registration_ids: devices,
            data
        });

        return new Promise((resolve, reject) => {
            this.gcmSender.send(message, (err, response) => {
                if (err) {
                    console.log(err);
                    return Promise.reject({ code: 500, message: 'Unexpected error.', resp: err });
                } else {
                    return resolve({ code: 200, message: 'Notification sent', resp: response });
                }
            });
        });
    }

    _pushIOs(devices, data) {
        return new Promise((resolve, reject) => {
            resolve({ code: 200, message: 'Notification sent', resp: {} });
        });
    }
}

module.exports = NotificationService;