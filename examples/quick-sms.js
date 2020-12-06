const SMS = require('../')

const sms = new SMS('RWxHRkd6aXlBZ3NOaUdMSWpGTkw=')

sms.send('995555123456', 'Hello!',  'GOSMS.GE')
    .then(body => console.log(body)) // returns { message_id: 'string' }
    .catch(err => console.log(err.message));
