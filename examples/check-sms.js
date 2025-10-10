const { SMS } = require('../dist');

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

// Replace 'MESSAGE_ID_HERE' with the actual message ID from send() response
sms
  .status('MESSAGE_ID_HERE')
  .then(body => {
    console.log('Success:', body);
    // Response includes: success, messageId, from, to, text, status, sendAt, etc.
  })
  .catch(err => console.log('Error:', err.message));
