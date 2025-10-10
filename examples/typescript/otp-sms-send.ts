import { SMS, OtpSendResponse, SmsError } from '@gosmsge/gosmsge-node';

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

async function sendOTP(): Promise<void> {
  try {
    const response = (await sms.sendOtp('995555123456')) as OtpSendResponse;

    console.log('✅ OTP sent successfully');
    console.log('Hash:', response.hash);
    console.log('To:', response.to);
    console.log('Balance:', response.balance);
    console.log('Sent at:', response.sendAt);
    console.log('Encode:', response.encode);
    console.log('Segments:', response.segment);
    console.log('Characters:', response.smsCharacters);

    console.log('\n⚠️  IMPORTANT: Save the hash for OTP verification!');
    console.log('Hash to save:', response.hash);

    // In a real application, you would:
    // 1. Save the hash to session/database
    // 2. Send it to the verification endpoint
    // 3. User receives SMS with OTP code
    // 4. User enters the code
    // 5. Verify using the saved hash and user's code
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Error sending OTP');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Example with error handling and retry logic
async function sendOTPWithRetry(phoneNumber: string, maxRetries = 3): Promise<string | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Sending OTP to ${phoneNumber}`);

      const response = (await sms.sendOtp(phoneNumber)) as OtpSendResponse;

      console.log(`✅ OTP sent successfully on attempt ${attempt}`);
      return response.hash;
    } catch (error) {
      const smsError = error as SmsError;
      console.error(`❌ Attempt ${attempt} failed: ${smsError.message}`);

      if (attempt === maxRetries) {
        console.error('Max retries reached. OTP sending failed.');
        return null;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt - 1) * 1000;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  return null;
}

// Execute examples
(async () => {
  console.log('--- Basic OTP Send Example ---\n');
  await sendOTP();

  console.log('\n--- OTP Send with Retry Example ---\n');
  const hash = await sendOTPWithRetry('995555123456');
  if (hash) {
    console.log('\n✅ Final hash:', hash);
    console.log('Use this hash with verifyOtp() method');
  } else {
    console.log('\n❌ Failed to send OTP after all retries');
  }
})();
