const { SMS } = require('../dist');

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

sms
  .balance()
  .then(body => {
    console.log('Success:', body);
    // Response: { success: true, balance: number }
  })
  .catch(err => console.log('Error:', err.message));
