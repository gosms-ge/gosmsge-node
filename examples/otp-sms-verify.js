const { SMS } = require('../dist');

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

// Use the hash received from sendOtp() and the code sent to the user's phone
sms
  .verifyOtp('995555123456', 'HASH_FROM_SENDOTP_RESPONSE', '1234')
  .then(body => {
    console.log('Success:', body);
    // Response: { success: true/false, verify: true/false }
  })
  .catch(err => console.log('Error:', err.message));
