const {SMS} = require('../dist')


const sms = new SMS('7b881a291db6dfce5c1b1b31540c22f4167b9e73aafbefaea3c2ad4b4bbad15f')

sms.send('555661277', 'Hello!',  'GOSMS.GE')
    .then(body => console.log(body)) // returns { message_id: 'string' }
    .catch(err => console.log(err.message));
