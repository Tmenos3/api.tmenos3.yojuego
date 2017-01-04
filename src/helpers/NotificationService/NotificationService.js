var fetch = require('node-fetch');
var Headers = require('node-fetch').Headers;
//var apn = require('apn');
var gcm = require('node-gcm-service');
//var Nofitication = require('./Notification');
//var config = require('config');

class NotificationService {
    constructor() {
        this.send = this.send.bind(this);
        this._sendIOSNotification = this._sendIOSNotification.bind(this);
        this._sendANDROIDNotification = this._sendANDROIDNotification.bind(this);
    }

    send(notification) {
        //TODO: test null or undefined
        //TODO: test instance of Notification

        this._sendANDROIDNotification(notification);

        // switch (notification.device.platform) {
        //     case 'android':
        //         this._sendANDROIDNotification(notification);
        //         break;
        //     case 'ios':
        //         this._sendIOSNotification(notification);
        //         break;
        // }
    }

    _sendIOSNotification(notification) {
        var apnConnection = new apn.Connection({ production: false });

        var apnNotification = new apn.Notification();
        apnNotification.alert = notification.data;
        apnNotification.badge = 10;
        apnNotification.contentAvailable = true;

        apnConnection.pushNotification(apnNotification, new apn.Device(notification.deviceId));
    }

    _sendANDROIDNotification(notification) {

        // var message = new gcm.Message({
        //     data: {
        //         title: 'YoJuego!!!',
        //         message: 'Test Notification'
        //     },
        //     //data: notification.data,
        //     delay_while_idle: false,
        //     dry_run: false
        // });

        // var sender = new gcm.Sender();

        //var API_KEY = config.get('googleAPIKey');
        //var API_KEY = 'AIzaSyCdzE8NtWze73sHY1mjLZgAgVFWpOpmgao';
        //var API_KEY = 'AIzaSyB6yv-c4B8CfA4mM-4hSAmJzK3o1E0SWjs';
        var API_KEY = 'AAAAxt0ttfs:APA91bHjFLn4SajSyXyH4BAw1Rx7qGRKDkQGqwlC--wTG1hgEMyqAK71JlvBt6b4v2vukC4MC9OPKf7qLsND5KJjIz8GJd2eIGn1154VIWsz8KbfqPrmyKIIJxsn86u8eHN3Xt5HBRDJgltR3N4tgL4u8v17l2z7SA';
        // sender.setAPIKey(API_KEY);

        var deviceID = 'e7sMPpa8qCg:APA91bGqHf_ZuI_UHGUQCWO_ENU4ca9qAGqJ0Jmc7NWHVrtGzevaCQywSro3mNvyXN6LGiybqcXxeh1TsNFZlHdIvlPPAJP6LlvZV-c6NjTtqI0hjyrn3q6PaQlp0KRduOhOexqFF_nd';
        // sender.sendMessage(message.toString(), deviceID, true, (err, data) => {
        //     if (err) {
        //         return;
        //     } else {
        //         return;
        //     }
        // });

        const API_URL = "https://fcm.googleapis.com/fcm/send";

        let body = {
            "to": deviceID,
            "notification": {
                "title": "Simple FCM Client",
                "body": "This is a notification with NOTIFICATION and DATA (NOTIF).",
                "sound": "default",
                "click_action": "fcm.ACTION.HELLO"
            },
            "data": {
                "title": "Simple FCM Client",
                "body": "This is a notification with NOTIFICATION and DATA (DATA)",
                "click_action": "fcm.ACTION.HELLO",
                "remote": true
            },
            "priority": "high"
        }
        body = JSON.stringify(body);

        let headers = new Headers({
            "Content-Type": "application/json",
            "Content-Length": parseInt(body.length),
            "Authorization": "key=" + API_KEY
        });

        fetch(API_URL, { method: "POST", headers: headers, body })
            .then(response => {
                console.log("Send " + "notification-data" + " response", response);
            })
            .catch(error => {
                console.log("Error sending " + "notification-data", error);
            });
    }
}

module.exports = NotificationService;