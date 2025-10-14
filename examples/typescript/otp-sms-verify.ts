import { SMS, OtpVerifyResponse, SmsError } from '@gosmsge/gosmsge-node';

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

async function verifyOTP(): Promise<void> {
  // In a real application, you would:
  // 1. Get the hash from your session/database (saved from sendOtp response)
  // 2. Get the code from user input
  const savedHash = 'HASH_FROM_SENDOTP_RESPONSE';
  const userEnteredCode = '1234';

  try {
    const response = (await sms.verifyOtp(
      '995555123456',
      savedHash,
      userEnteredCode
    )) as OtpVerifyResponse;

    console.log('Response:', response);

    if (response.verify) {
      console.log('✅ OTP verified successfully!');
      console.log('User authentication successful');
      // Proceed with login/registration
    } else {
      console.log('❌ Invalid OTP code');
      console.log('The code entered by the user is incorrect');
      // Show error to user, allow retry
    }
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Error verifying OTP');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Complete OTP flow example
interface OTPSession {
  phoneNumber: string;
  hash: string;
  attempts: number;
  expiresAt: Date;
}

class OTPService {
  private smsClient: InstanceType<typeof SMS>;
  private sessions: Map<string, OTPSession> = new Map();
  private maxAttempts = 3;
  private otpExpiryMinutes = 10;

  constructor(apiKey: string) {
    this.smsClient = new SMS(apiKey);
  }

  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      const response = (await this.smsClient.sendOtp(phoneNumber)) as any;

      // Store session
      this.sessions.set(phoneNumber, {
        phoneNumber,
        hash: response.hash,
        attempts: 0,
        expiresAt: new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000),
      });

      console.log(`✅ OTP sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      const smsError = error as SmsError;
      console.error(`❌ Failed to send OTP: ${smsError.message}`);
      return false;
    }
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
    const session = this.sessions.get(phoneNumber);

    if (!session) {
      console.error('❌ No OTP session found for this phone number');
      return false;
    }

    if (new Date() > session.expiresAt) {
      console.error('❌ OTP has expired');
      this.sessions.delete(phoneNumber);
      return false;
    }

    if (session.attempts >= this.maxAttempts) {
      console.error('❌ Maximum verification attempts exceeded');
      this.sessions.delete(phoneNumber);
      return false;
    }

    session.attempts++;

    try {
      const response = (await this.smsClient.verifyOtp(
        phoneNumber,
        session.hash,
        code
      )) as OtpVerifyResponse;

      if (response.verify) {
        console.log('✅ OTP verified successfully');
        this.sessions.delete(phoneNumber);
        return true;
      } else {
        console.log(`❌ Invalid OTP code (Attempt ${session.attempts}/${this.maxAttempts})`);
        return false;
      }
    } catch (error) {
      const smsError = error as SmsError;
      console.error(`❌ Verification error: ${smsError.message}`);
      return false;
    }
  }

  clearSession(phoneNumber: string): void {
    this.sessions.delete(phoneNumber);
  }
}

// Execute examples
(async () => {
  console.log('--- Basic OTP Verification Example ---\n');
  await verifyOTP();

  console.log('\n--- Complete OTP Service Example ---\n');

  const otpService = new OTPService('YOUR_API_KEY_HERE');
  const testPhone = '995555123456';

  // Send OTP
  console.log('Step 1: Sending OTP...');
  const sent = await otpService.sendOTP(testPhone);

  if (sent) {
    console.log('\nStep 2: User receives SMS with OTP code');
    console.log('Step 3: User enters code in your application');

    // Simulate user entering code
    console.log('\nStep 4: Verifying OTP...');

    // Try with wrong code first
    console.log('\nAttempt 1: Wrong code');
    await otpService.verifyOTP(testPhone, '0000');

    // Try with correct code (in real scenario)
    console.log('\nAttempt 2: Correct code (simulated)');
    // await otpService.verifyOTP(testPhone, 'ACTUAL_CODE_FROM_SMS');

    console.log('\n⚠️  Note: Replace API key and use actual OTP code from SMS');
  }
})();
