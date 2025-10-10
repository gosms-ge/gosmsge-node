import { SMS, CheckStatusResponse, SmsError } from '@gosmsge/gosmsge-node';

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://gosms.ge
const sms = new SMS('YOUR_API_KEY_HERE');

async function checkMessageStatus(): Promise<void> {
  // Replace with actual message ID from send() response
  const messageId = 'MESSAGE_ID_HERE';

  try {
    const response = (await sms.status(messageId)) as CheckStatusResponse;

    console.log('✅ Status retrieved successfully');
    console.log('Success:', response.success);
    console.log('Message ID:', response.messageId);
    console.log('From:', response.from);
    console.log('To:', response.to);
    console.log('Text:', response.text);
    console.log('Status:', response.status);
    console.log('Sent at:', response.sendAt);
    console.log('Encode:', response.encode);
    console.log('Segments:', response.segment);
    console.log('Characters:', response.smsCharacters);

    // Status interpretation
    switch (response.status.toLowerCase()) {
      case 'delivered':
        console.log('✅ Message delivered successfully');
        break;
      case 'pending':
        console.log('⏳ Message is pending delivery');
        break;
      case 'failed':
        console.log('❌ Message delivery failed');
        break;
      case 'sent':
        console.log('📤 Message sent, awaiting delivery confirmation');
        break;
      default:
        console.log('ℹ️  Status:', response.status);
    }
  } catch (error) {
    const smsError = error as SmsError;
    console.error('❌ Error checking message status');
    console.error('Error code:', smsError.errorCode);
    console.error('Message:', smsError.message);
  }
}

// Message tracking service
interface MessageRecord {
  messageId: string;
  phoneNumber: string;
  text: string;
  sentAt: Date;
  status: string;
  lastChecked: Date;
}

class MessageTracker {
  private smsClient: InstanceType<typeof SMS>;
  private messages: Map<string, MessageRecord> = new Map();

  constructor(apiKey: string) {
    this.smsClient = new SMS(apiKey);
  }

  async trackMessage(messageId: string): Promise<void> {
    try {
      const response = (await this.smsClient.status(messageId)) as CheckStatusResponse;

      const record: MessageRecord = {
        messageId: response.messageId.toString(),
        phoneNumber: response.to,
        text: response.text,
        sentAt: response.sendAt,
        status: response.status,
        lastChecked: new Date(),
      };

      this.messages.set(messageId, record);

      console.log(`Tracked message ${messageId}: ${response.status}`);
    } catch (error) {
      const smsError = error as SmsError;
      console.error(`Failed to track message ${messageId}: ${smsError.message}`);
    }
  }

  async updateAllStatuses(): Promise<void> {
    console.log(`Updating status for ${this.messages.size} messages...`);

    for (const [messageId, record] of this.messages.entries()) {
      try {
        const response = (await this.smsClient.status(messageId)) as CheckStatusResponse;

        record.status = response.status;
        record.lastChecked = new Date();

        console.log(`${messageId}: ${response.status}`);
      } catch (error) {
        console.error(`Failed to update ${messageId}`);
      }

      // Rate limiting: wait between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  getMessagesByStatus(status: string): MessageRecord[] {
    return Array.from(this.messages.values()).filter(
      msg => msg.status.toLowerCase() === status.toLowerCase()
    );
  }

  getAllMessages(): MessageRecord[] {
    return Array.from(this.messages.values());
  }

  getStatusSummary(): Record<string, number> {
    const summary: Record<string, number> = {};

    for (const record of this.messages.values()) {
      const status = record.status.toLowerCase();
      summary[status] = (summary[status] || 0) + 1;
    }

    return summary;
  }
}

// Poll message until delivered
async function waitForDelivery(
  messageId: string,
  maxAttempts = 10,
  intervalSeconds = 5
): Promise<boolean> {
  console.log(`Waiting for message ${messageId} to be delivered...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = (await sms.status(messageId)) as CheckStatusResponse;

      console.log(
        `Attempt ${attempt}/${maxAttempts}: Status = ${response.status}`
      );

      if (response.status.toLowerCase() === 'delivered') {
        console.log('✅ Message delivered successfully!');
        return true;
      }

      if (response.status.toLowerCase() === 'failed') {
        console.log('❌ Message delivery failed');
        return false;
      }

      // Wait before next check
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
      }
    } catch (error) {
      const smsError = error as SmsError;
      console.error(`Error checking status: ${smsError.message}`);
    }
  }

  console.log('⏱️  Timeout: Max attempts reached');
  return false;
}

// Bulk status checker
async function checkMultipleMessages(messageIds: string[]): Promise<void> {
  console.log(`Checking status for ${messageIds.length} messages...\n`);

  const results: Array<{ id: string; status: string; error?: string }> = [];

  for (const messageId of messageIds) {
    try {
      const response = (await sms.status(messageId)) as CheckStatusResponse;
      results.push({
        id: messageId,
        status: response.status,
      });
      console.log(`✅ ${messageId}: ${response.status}`);
    } catch (error) {
      const smsError = error as SmsError;
      results.push({
        id: messageId,
        status: 'error',
        error: smsError.message,
      });
      console.error(`❌ ${messageId}: ${smsError.message}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Summary
  console.log('\n--- Summary ---');
  const statusCounts: Record<string, number> = {};
  for (const result of results) {
    statusCounts[result.status] = (statusCounts[result.status] || 0) + 1;
  }
  console.log(statusCounts);
}

// Execute examples
(async () => {
  console.log('--- Basic Status Check Example ---\n');
  await checkMessageStatus();

  console.log('\n--- Message Tracker Example ---\n');
  const tracker = new MessageTracker('YOUR_API_KEY_HERE');

  console.log('Note: Replace MESSAGE_ID_HERE with actual message IDs');
  console.log('Example usage:');
  console.log('');
  console.log("await tracker.trackMessage('12345');");
  console.log("await tracker.trackMessage('12346');");
  console.log('await tracker.updateAllStatuses();');
  console.log('const summary = tracker.getStatusSummary();');
  console.log('console.log(summary);');

  console.log('\n--- Wait for Delivery Example ---\n');
  console.log('This would poll message status until delivered:');
  console.log("await waitForDelivery('MESSAGE_ID', 10, 5);");

  console.log('\n--- Bulk Status Check Example ---\n');
  console.log('Check multiple messages at once:');
  console.log("await checkMultipleMessages(['id1', 'id2', 'id3']);");
})();
