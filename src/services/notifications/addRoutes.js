let AndroidNotification = require('./models/AndroidNotification');
let IOsNotification = require('./models/IOsNotification');
let Device = require('./models/Device');
let DeviceRepository = require('./repositories/DeviceESRepository');

module.exports = (server, esClient, notificationService) => {
  server.post('/notification/register', (req, res, next) => {
    let notification = new IOsNotification(req.body.devices, req.body.data)
    notificationService.push(notification)
      .then((resp) => {
        res.json(200, { code: 200, message: 'Notification sent', resp: resp });
      });
  });

  server.put('/notification/ios', (req, res, next) => {
    let notification = new IOsNotification(req.body.devices, req.body.data)
    notificationService.push(notification)
      .then((resp) => {
        res.json(200, { code: 200, message: 'Notification sent', resp: resp });
      });
  });

  server.put('/notification/android', (req, res, next) => {
    let notification = new AndroidNotification(req.body.devices, req.body.data)
    notificationService.push(notification)
      .then((resp) => {
        res.json(200, { code: 200, message: 'Notification sent', resp: resp });
      });
  });
}