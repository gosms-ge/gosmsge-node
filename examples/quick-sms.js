// Send sms with Smart or SmartPro type
const SMS = require('../')

const sms = new SMS('RWxHRkd6aXlBZ3NOaUdMSWpGTkw=')

sms.send('995557205522', 'Hello!',  'GOSMS.GE')
    .then(body => console.log(body)) // returns { message_id: 'string' }
    .catch(err => console.log(err.message));
