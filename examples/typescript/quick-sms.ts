import { SMS, SmsSendResponse, SmsError } from '@gosmsge/gosmsge-node';

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

async function sendQuickSMS(): Promise<void> {
  try {
    const response = (await sms.send(
      '995555123456',
      'Hello from TypeScript!',
      'GOSMS.GE'
    )) as SmsSendResponse;

    console.log('✅ SMS sent successfully');
    console.log('Message ID:', response.messageId);
    console.log('From:', response.from);
    console.log('To:', response.to);
    console.log('Text:', response.text);
    console.log('Balance:', response.balance);
    console.log('Segments:', response.segment);
    console.log('Characters:', response.smsCharacters);
    console.log('Sent at:', response.sendAt);
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Error sending SMS');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Send urgent SMS
async function sendUrgentSMS(): Promise<void> {
  try {
    const response = (await sms.send(
      '995555123456',
      'Urgent notification!',
      'GOSMS.GE',
      true // urgent flag
    )) as SmsSendResponse;

    console.log('✅ Urgent SMS sent successfully');
    console.log('Message ID:', response.messageId);
    console.log('Balance:', response.balance);
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Error sending urgent SMS');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Execute examples
(async () => {
  console.log('--- Quick SMS Example ---\n');
  await sendQuickSMS();

  console.log('\n--- Urgent SMS Example ---\n');
  await sendUrgentSMS();
})();
