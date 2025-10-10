import { SMS, BalanceResponse, SmsError } from '@gosmsge/gosmsge-node';

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

async function checkBalance(): Promise<void> {
  try {
    const response = (await sms.balance()) as BalanceResponse;

    console.log('✅ Balance retrieved successfully');
    console.log('Success:', response.success);
    console.log('Balance:', response.balance, 'SMS credits');

    // Check if balance is low
    if (response.balance < 10) {
      console.log('⚠️  WARNING: Low balance! Please top up your account.');
    } else if (response.balance < 50) {
      console.log('⚠️  Balance is getting low. Consider topping up soon.');
    } else {
      console.log('✅ Balance is sufficient.');
    }
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Error checking balance');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Balance monitoring service
class BalanceMonitor {
  private smsClient: InstanceType<typeof SMS>;
  private lowBalanceThreshold: number;
  private criticalBalanceThreshold: number;

  constructor(
    apiKey: string,
    lowBalanceThreshold = 50,
    criticalBalanceThreshold = 10
  ) {
    this.smsClient = new SMS(apiKey);
    this.lowBalanceThreshold = lowBalanceThreshold;
    this.criticalBalanceThreshold = criticalBalanceThreshold;
  }

  async checkAndAlert(): Promise<number | null> {
    try {
      const response = (await this.smsClient.balance()) as BalanceResponse;
      const balance = response.balance;

      console.log(`Current balance: ${balance} SMS credits`);

      if (balance <= this.criticalBalanceThreshold) {
        console.error('🚨 CRITICAL: Balance extremely low!');
        console.error('Action required: Top up immediately to continue sending SMS');
        // In production: Send alert email, Slack notification, etc.
      } else if (balance <= this.lowBalanceThreshold) {
        console.warn('⚠️  WARNING: Balance is low');
        console.warn('Recommendation: Top up your account soon');
        // In production: Send warning notification
      } else {
        console.log('✅ Balance is healthy');
      }

      return balance;
    } catch (error) {
      const smsError = error as SmsError;
      console.error(`❌ Failed to check balance: ${smsError.message}`);
      return null;
    }
  }

  async getBalancePercentage(totalCredits: number): Promise<number | null> {
    try {
      const response = (await this.smsClient.balance()) as BalanceResponse;
      const percentage = (response.balance / totalCredits) * 100;

      console.log(`Balance: ${response.balance}/${totalCredits} (${percentage.toFixed(1)}%)`);

      return percentage;
    } catch (error) {
      return null;
    }
  }

  async canSendMessages(requiredCount: number): Promise<boolean> {
    try {
      const response = (await this.smsClient.balance()) as BalanceResponse;

      if (response.balance >= requiredCount) {
        console.log(`✅ Sufficient balance for ${requiredCount} messages`);
        return true;
      } else {
        console.error(`❌ Insufficient balance for ${requiredCount} messages`);
        console.error(`Available: ${response.balance}, Required: ${requiredCount}`);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}

// Periodic balance checking
class BalanceWatcher {
  private monitor: BalanceMonitor;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(apiKey: string) {
    this.monitor = new BalanceMonitor(apiKey);
  }

  start(intervalMinutes = 60): void {
    console.log(`Starting balance watcher (checking every ${intervalMinutes} minutes)...`);

    // Check immediately
    this.monitor.checkAndAlert();

    // Then check periodically
    this.intervalId = setInterval(() => {
      console.log('\n--- Periodic Balance Check ---');
      this.monitor.checkAndAlert();
    }, intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Balance watcher stopped');
    }
  }
}

// Execute examples
(async () => {
  console.log('--- Basic Balance Check Example ---\n');
  await checkBalance();

  console.log('\n--- Balance Monitor Example ---\n');
  const monitor = new BalanceMonitor('YOUR_API_KEY_HERE', 50, 10);

  console.log('Checking balance with alerts:');
  await monitor.checkAndAlert();

  console.log('\nChecking if can send 100 messages:');
  await monitor.canSendMessages(100);

  console.log('\nChecking balance percentage:');
  await monitor.getBalancePercentage(1000); // Assuming 1000 total credits purchased

  console.log('\n--- Balance Watcher Example ---\n');
  console.log('Note: This would run continuously in a real application');
  console.log('Uncomment the code below to test:');
  console.log('');
  console.log('const watcher = new BalanceWatcher("YOUR_API_KEY_HERE");');
  console.log('watcher.start(60); // Check every 60 minutes');
  console.log('// Later: watcher.stop();');
})();
