const { SMS } = require('../dist');

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

sms
  .sendOtp('995555123456')
  .then(body => {
    console.log('Success:', body);
    // Response includes: success, hash, to, balance, sendAt, etc.
    // Save the hash for OTP verification
  })
  .catch(err => console.log('Error:', err.message));
