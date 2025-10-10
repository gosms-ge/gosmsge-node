# TypeScript Examples for @gosmsge/gosmsge-node

This directory contains comprehensive TypeScript examples demonstrating how to use the GOSMS.ge Node.js SDK with proper typing, error handling, and production-ready patterns.

## 📋 Prerequisites

- Node.js >= 18.0.0
- TypeScript >= 5.0.0
- Valid GOSMS.ge API key (get one at https://gosms.ge)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @gosmsge/gosmsge-node typescript ts-node
```

### 2. Replace API Key

In all example files, replace `'YOUR_API_KEY_HERE'` with your actual API key from GOSMS.ge.

### 3. Run Examples

```bash
# Using ts-node (recommended)
npx ts-node examples/typescript/quick-sms.ts

# Or compile first, then run
npx tsc examples/typescript/quick-sms.ts
node examples/typescript/quick-sms.js
```

## 📁 Available Examples

### 1. **quick-sms.ts** - Basic SMS Sending
- Simple SMS sending
- Urgent message flag
- Response handling
- Error handling with types

**Run:**
```bash
npx ts-node examples/typescript/quick-sms.ts
```

**Key features:**
- Type-safe API calls
- Proper error typing
- Response field access

---

### 2. **otp-sms-send.ts** - Send OTP
- Basic OTP sending
- Hash retrieval for verification
- Retry logic with exponential backoff
- Production workflow patterns

**Run:**
```bash
npx ts-node examples/typescript/otp-sms-send.ts
```

**Key features:**
- OTP hash management
- Retry mechanism
- Error handling

---

### 3. **otp-sms-verify.ts** - Verify OTP
- Basic OTP verification
- Complete OTP service class
- Session management
- Attempt limiting
- Expiry handling

**Run:**
```bash
npx ts-node examples/typescript/otp-sms-verify.ts
```

**Key features:**
- OTPService class for production
- Session tracking
- Maximum attempts
- Time-based expiry

---

### 4. **check-balance.ts** - Balance Management
- Simple balance check
- BalanceMonitor class
- Low balance alerts
- Balance percentage calculation
- Periodic balance watching

**Run:**
```bash
npx ts-node examples/typescript/check-balance.ts
```

**Key features:**
- Balance monitoring service
- Alert thresholds
- Periodic checking
- Pre-send balance validation

---

### 5. **check-sms.ts** - Message Status Tracking
- Basic status check
- MessageTracker class
- Bulk status checking
- Delivery polling
- Status summaries

**Run:**
```bash
npx ts-node examples/typescript/check-sms.ts
```

**Key features:**
- Message tracking service
- Status polling
- Bulk operations
- Delivery confirmation

---

### 6. **advanced-usage.ts** - Advanced Features
- Debug mode configuration
- Custom timeout settings
- Retry logic configuration
- ProductionSMSService class
- Environment-aware configuration

**Run:**
```bash
npx ts-node examples/typescript/advanced-usage.ts
```

**Key features:**
- Debug logging
- Timeout configuration
- Automatic retries
- Production-ready service
- Bulk sending with rate limiting

---

## 🔧 Configuration Options

All examples use the SMS client with optional configuration:

```typescript
import { SMS } from '@gosmsge/gosmsge-node';

const sms = new SMS('your_api_key', {
  debug: true,      // Enable debug logging (default: false)
  timeout: 30000,   // Request timeout in ms (default: 30000)
  retries: 3,       // Number of retry attempts (default: 1)
});
```

## 📝 TypeScript Types

The package includes full TypeScript definitions:

```typescript
import {
  SMS,
  SmsSendResponse,
  OtpSendResponse,
  OtpVerifyResponse,
  CheckStatusResponse,
  BalanceResponse,
  SenderCreateResponse,
  SmsError,
} from '@gosmsge/gosmsge-node';
```

## 🎯 Common Patterns

### Error Handling

```typescript
try {
  const response = await sms.send('995555123456', 'Hello', 'GOSMS.GE');
  console.log('Success:', response.messageId);
} catch (error) {
  const smsError = error as SmsError;
  console.error('Error code:', smsError.errorCode);
  console.error('Message:', smsError.message);
}
```

### Type Assertions

```typescript
// When you need to access specific response properties
const response = (await sms.send('995555123456', 'Hello', 'GOSMS.GE')) as SmsSendResponse;
console.log('Balance:', response.balance);
```

### Async/Await vs Promises

```typescript
// Recommended: async/await
async function sendSMS() {
  const response = await sms.send('995555123456', 'Hello', 'GOSMS.GE');
  return response;
}

// Alternative: promises
sms.send('995555123456', 'Hello', 'GOSMS.GE')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

## 🏗️ Production Best Practices

### 1. Environment Variables

```typescript
const sms = new SMS(process.env.GOSMS_API_KEY!, {
  debug: process.env.NODE_ENV === 'development',
  retries: process.env.NODE_ENV === 'production' ? 3 : 1,
});
```

### 2. Error Logging

```typescript
catch (error) {
  const smsError = error as SmsError;
  // Log to your monitoring service
  logger.error('SMS failed', {
    errorCode: smsError.errorCode,
    message: smsError.message,
    phoneNumber: phoneNumber,
  });
}
```

### 3. Rate Limiting

```typescript
for (const phone of phoneNumbers) {
  await sms.send(phone, text, sender);
  await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
}
```

### 4. Balance Monitoring

```typescript
const balance = await sms.balance();
if (balance.balance < MINIMUM_THRESHOLD) {
  await alertLowBalance();
}
```

## 📚 Additional Resources

- [Main README](../../README.md) - Package documentation
- [API Documentation](https://gosms.ge/docs) - GOSMS.ge API docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines

## 🐛 Troubleshooting

### Issue: "Cannot find module '@gosmsge/gosmsge-node'"

**Solution:**
```bash
npm install @gosmsge/gosmsge-node
```

### Issue: "API key is required"

**Solution:** Make sure you've replaced `'YOUR_API_KEY_HERE'` with your actual API key.

### Issue: TypeScript compilation errors

**Solution:** Ensure you have TypeScript 5.0+ installed:
```bash
npm install --save-dev typescript@latest
```

### Issue: "TS2345: Argument of type X is not assignable to parameter"

**Solution:** The package uses strict TypeScript. Make sure your types match the expected parameters.

## 💡 Tips

1. **Start with quick-sms.ts** to understand the basics
2. **Use debug mode** during development to see what's happening
3. **Check balance** before sending bulk messages
4. **Implement retry logic** for production environments
5. **Track message IDs** for status checking
6. **Use environment variables** for API keys

## 📞 Support

- Issues: https://github.com/gosms-ge/gosmsge-node/issues
- Email: info@gosms.ge
- Website: https://gosms.ge

## 📄 License

ISC License - see [LICENSE](../../LICENSE) file for details
