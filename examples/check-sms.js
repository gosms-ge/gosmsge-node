// Send sms with Smart or SmartPro type
const SMS = require('../')

const sms = new SMS('RWxHRkd6aXlBZ3NOaUdMSWpGTkw=')

sms.status('1560686561')
    .then(body => console.log(body)) // returns { message_id: 'string' }
    .catch(err => console.log(err.message));
