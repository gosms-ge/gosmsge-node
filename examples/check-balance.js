const {SMS} = require('../dist')

const sms = new SMS('RWxHRkd6aXlBZ3NOaUdMSWpGTkw=')

sms.balance()
    .then(body => console.log(body)) // returns { message_id: 'string' }
    .catch(err => console.log(err.message));
