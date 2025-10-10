import { SMS, SmsSendResponse, SmsError } from '@gosmsge/gosmsge-node';

// Advanced configuration examples
console.log('=== Advanced SMS Client Configuration ===\n');

// 1. Basic client (default settings)
const basicClient = new SMS('YOUR_API_KEY_HERE');
console.log('✅ Basic client created with default settings');

// 2. Client with debug mode enabled
const debugClient = new SMS('YOUR_API_KEY_HERE', {
  debug: true, // Enable debug logging
});
console.log('✅ Debug client created (logs all requests/responses)');

// 3. Client with custom timeout
const timeoutClient = new SMS('YOUR_API_KEY_HERE', {
  timeout: 10000, // 10 seconds timeout
});
console.log('✅ Client with 10s timeout created');

// 4. Client with retry logic
const retryClient = new SMS('YOUR_API_KEY_HERE', {
  retries: 3, // Retry up to 3 times on failure
});
console.log('✅ Client with 3 retries created');

// 5. Client with all options
const advancedClient = new SMS('YOUR_API_KEY_HERE', {
  debug: true, // Enable debug logging
  timeout: 15000, // 15 seconds timeout
  retries: 3, // Retry up to 3 times
});
console.log('✅ Advanced client created with all options\n');

// Example 1: Debug mode
async function debugModeExample(): Promise<void> {
  console.log('--- Debug Mode Example ---\n');

  const sms = new SMS('YOUR_API_KEY_HERE', { debug: true });

  try {
    console.log('Sending SMS with debug logging enabled...');
    const response = (await sms.send(
      '995555123456',
      'Test with debug',
      'GOSMS.GE'
    )) as SmsSendResponse;

    console.log('Message sent successfully');
    console.log('Message ID:', response.messageId);
    // Debug logs will show:
    // - Request attempt number
    // - Request endpoint and method
    // - Response data
  } catch (error) {
    // Debug logs will show:
    // - Error details
    // - Retry attempts
    console.error('Error:', (error as SmsError).message);
  }
}

// Example 2: Retry logic with exponential backoff
async function retryExample(): Promise<void> {
  console.log('--- Retry Logic Example ---\n');

  const sms = new SMS('YOUR_API_KEY_HERE', {
    debug: true,
    retries: 3, // Will try up to 3 times
  });

  try {
    console.log('Sending SMS with retry enabled...');
    const response = (await sms.send(
      '995555123456',
      'Message with retry',
      'GOSMS.GE'
    )) as SmsSendResponse;

    console.log('✅ Message sent (may have retried on failure)');
    console.log('Message ID:', response.messageId);

    // If the first attempt fails, the client will:
    // 1. Wait 1 second (2^0 * 1000ms)
    // 2. Retry
    // 3. If fails again, wait 2 seconds (2^1 * 1000ms)
    // 4. Retry
    // 5. If fails again, wait 4 seconds (2^2 * 1000ms)
    // 6. Final retry
  } catch (error) {
    console.error('❌ All retries exhausted');
    console.error('Error:', (error as SmsError).message);
  }
}

// Example 3: Timeout handling
async function timeoutExample(): Promise<void> {
  console.log('--- Timeout Example ---\n');

  const sms = new SMS('YOUR_API_KEY_HERE', {
    timeout: 5000, // 5 seconds timeout
    debug: true,
  });

  try {
    console.log('Sending SMS with 5s timeout...');
    const response = (await sms.send(
      '995555123456',
      'Message with timeout',
      'GOSMS.GE'
    )) as SmsSendResponse;

    console.log('✅ Message sent within timeout');
    console.log('Message ID:', response.messageId);
  } catch (error) {
    console.error('❌ Request timed out or failed');
    console.error('Error:', (error as SmsError).message);
  }
}

// Example 4: Combined advanced features
async function combinedExample(): Promise<void> {
  console.log('--- Combined Advanced Features Example ---\n');

  const sms = new SMS('YOUR_API_KEY_HERE', {
    debug: true, // See what's happening
    timeout: 10000, // 10 second timeout per attempt
    retries: 3, // Retry up to 3 times
  });

  console.log('Configuration:');
  console.log('- Debug: enabled');
  console.log('- Timeout: 10 seconds per attempt');
  console.log('- Retries: 3 attempts total\n');

  try {
    const response = (await sms.send(
      '995555123456',
      'Advanced SMS',
      'GOSMS.GE'
    )) as SmsSendResponse;

    console.log('✅ Message sent successfully');
    console.log('Message ID:', response.messageId);
    console.log('Balance:', response.balance);
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Failed after all retries');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Example 5: Production-ready SMS service
class ProductionSMSService {
  private client: InstanceType<typeof SMS>;
  private isDevelopment: boolean;

  constructor(apiKey: string, isDevelopment = false) {
    this.isDevelopment = isDevelopment;

    // Configure based on environment
    this.client = new SMS(apiKey, {
      debug: isDevelopment, // Debug only in development
      timeout: isDevelopment ? 5000 : 30000, // Shorter timeout in dev
      retries: isDevelopment ? 1 : 3, // More retries in production
    });
  }

  async sendWithErrorHandling(
    phoneNumber: string,
    text: string,
    senderName: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = (await this.client.send(
        phoneNumber,
        text,
        senderName
      )) as SmsSendResponse;

      return {
        success: true,
        messageId: response.messageId.toString(),
      };
    } catch (error) {
      const smsError = error as SmsError;

      // Log error (in production, send to monitoring service)
      if (this.isDevelopment) {
        console.error('SMS Error:', smsError);
      }

      return {
        success: false,
        error: smsError.message,
      };
    }
  }

  async sendBulk(
    phoneNumbers: string[],
    text: string,
    senderName: string
  ): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{ phone: string; success: boolean; messageId?: string }>;
  }> {
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const phoneNumber of phoneNumbers) {
      const result = await this.sendWithErrorHandling(phoneNumber, text, senderName);

      results.push({
        phone: phoneNumber,
        success: result.success,
        messageId: result.messageId,
      });

      if (result.success) {
        successful++;
      } else {
        failed++;
      }

      // Rate limiting: wait between sends
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return {
      total: phoneNumbers.length,
      successful,
      failed,
      results,
    };
  }
}

// Execute examples
(async () => {
  console.log('\n⚠️  These examples demonstrate advanced features.');
  console.log('Replace YOUR_API_KEY_HERE with your actual API key to test.\n');

  // Uncomment to run examples:
  // await debugModeExample();
  // await retryExample();
  // await timeoutExample();
  // await combinedExample();

  console.log('\n--- Production SMS Service Example ---\n');
  console.log('Usage:');
  console.log('');
  console.log("const smsService = new ProductionSMSService('API_KEY', true);");
  console.log('');
  console.log('// Send single message');
  console.log(
    "const result = await smsService.sendWithErrorHandling('995555123456', 'Hello', 'GOSMS');"
  );
  console.log('console.log(result);');
  console.log('');
  console.log('// Send bulk messages');
  console.log("const phones = ['995555123456', '995555123457'];");
  console.log("const bulk = await smsService.sendBulk(phones, 'Bulk SMS', 'GOSMS');");
  console.log('console.log(bulk);');
  console.log('');
  console.log('Key features:');
  console.log('✅ Environment-aware configuration');
  console.log('✅ Automatic retry on failure');
  console.log('✅ Debug logging in development');
  console.log('✅ Error handling and reporting');
  console.log('✅ Bulk sending with rate limiting');
})();
