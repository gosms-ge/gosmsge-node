const { SMS } = require('../dist');

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

sms
  .send('995555123456', 'Hello!', 'GOSMS.GE')
  .then(body => {
    console.log('Success:', body);
    // Response includes: success, messageId, from, to, text, balance, etc.
  })
  .catch(err => console.log('Error:', err.message));
