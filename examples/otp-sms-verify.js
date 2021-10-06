const {SMS} = require('../dist')

const sms = new SMS('RWxHRkd6aXlBZ3NOaUdMSWpGTkw=')

sms.verifyOtp('995555123456', '37d167145f4794b774d28e1b240faab1bd05a024df67a935a113f3c265503a9d.1623146284808', '8200')
    .then(body => console.log(body)) // returns { success: 'boolean', verify: 'boolean' }
    .catch(err => console.log(err.message));
