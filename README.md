[![npm version](https://badge.fury.io/js/%40gosmsge%2Fgosmsge-node.svg)](https://www.npmjs.com/package/@gosmsge/gosmsge-node)
[![npm downloads](https://img.shields.io/npm/dm/@gosmsge/gosmsge-node.svg)](https://www.npmjs.com/package/@gosmsge/gosmsge-node)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/node/v/@gosmsge/gosmsge-node.svg)](https://nodejs.org)
![Node.js Package](https://github.com/gosms-ge/gosmsge-node/workflows/Node.js%20Package/badge.svg)
[![CircleCI](https://circleci.com/gh/gosms-ge/gosmsge-node.svg?style=shield)](https://circleci.com/gh/gosms-ge/gosmsge-node)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# GOSMS.GE Node JS SMS Send

Node JS client module to send SMS messages using GOSMS.GE SMS Gateway.

To use this library, you must have a valid account on https://gosms.ge.

**Please note** SMS messages sent with this library will be deducted by your GOSMS.GE account credits.

For any questions, please contact us at info@gosms.ge

# Installation

```bash
$ npm install @gosmsge/gosmsge-node --save
```

# Usage

## Send SMS Message

```js
const { SMS } = require('@gosmsge/gosmsge-node');

const sms = new SMS('your_api_key');

sms
  .send('995555555555', 'Hello!', 'GOSMS.GE')
  .then(body => {
    console.log('Message sent successfully');
    console.log('Message ID:', body.messageId);
    console.log('Balance:', body.balance);
  })
  .catch(err => console.log('Error:', err.message));

// Send urgent message
sms
  .send('995555555555', 'Urgent message!', 'GOSMS.GE', true)
  .then(body => console.log(body))
  .catch(err => console.log(err.message));
```

## Check Message Status

```js
const { SMS } = require('@gosmsge/gosmsge-node');

const sms = new SMS('your_api_key');

sms
  .status('message_id')
  .then(body => {
    console.log('Message status:', body.status);
    console.log('From:', body.from);
    console.log('To:', body.to);
  })
  .catch(err => console.log('Error:', err.message));
```

## Check Balance

```js
const { SMS } = require('@gosmsge/gosmsge-node');

const sms = new SMS('your_api_key');

sms
  .balance()
  .then(body => {
    console.log('Balance:', body.balance);
  })
  .catch(err => console.log('Error:', err.message));
```

## OTP SMS

### Send OTP

```js
const { SMS } = require('@gosmsge/gosmsge-node');

const sms = new SMS('your_api_key');

sms
  .sendOtp('995555555555')
  .then(body => {
    console.log('OTP sent successfully');
    console.log('Hash:', body.hash); // Save this hash for verification
    console.log('Balance:', body.balance);
  })
  .catch(err => console.log('Error:', err.message));
```

### Verify OTP

```js
const { SMS } = require('@gosmsge/gosmsge-node');

const sms = new SMS('your_api_key');

// Use hash from sendOtp response and code from user
sms
  .verifyOtp('995555555555', 'hash_from_sendOtp', '1234')
  .then(body => {
    if (body.verify) {
      console.log('OTP verified successfully');
    } else {
      console.log('Invalid OTP code');
    }
  })
  .catch(err => console.log('Error:', err.message));
```

## Create Sender Name

```js
const { SMS } = require('@gosmsge/gosmsge-node');

const sms = new SMS('your_api_key');

sms
  .createSender('MyCompany')
  .then(body => {
    console.log('Sender created:', body.success);
  })
  .catch(err => console.log('Error:', err.message));
```

## TypeScript Usage

```typescript
import { SMS, SmsSendResponse, SmsError } from '@gosmsge/gosmsge-node';

const sms = new SMS('your_api_key');

async function sendMessage() {
  try {
    const response = (await sms.send(
      '995555555555',
      'Hello from TypeScript!',
      'GOSMS.GE'
    )) as SmsSendResponse;

    console.log('Message ID:', response.messageId);
    console.log('Balance:', response.balance);
  } catch (error) {
    const smsError = error as SmsError;
    console.error('Error:', smsError.message);
  }
}

sendMessage();
```

# API Reference

## Constructor

### `new SMS(api_key: string, options?: SMSOptions)`

Creates a new SMS client instance.

**Parameters:**

- `api_key` (string, required) - Your API key from https://gosms.ge
- `options` (object, optional) - Configuration options
  - `debug` (boolean) - Enable debug logging (default: `false`)
  - `timeout` (number) - Request timeout in milliseconds (default: `30000`)
  - `retries` (number) - Number of retry attempts for failed requests (default: `1`)

**Example:**

```typescript
const sms = new SMS('your_api_key');

// With options
const smsDebug = new SMS('your_api_key', {
  debug: true,
  timeout: 15000,
  retries: 3,
});
```

## Methods

### `send(phoneNumber: string, text: string, senderName: string, urgent?: boolean): Promise<SmsSendResponse>`

Sends an SMS message to a phone number.

**Parameters:**

- `phoneNumber` (string, required) - Phone number as a string (e.g., '995555555555')
- `text` (string, required) - Message text to send
- `senderName` (string, required) - Sender name (must be pre-registered on GOSMS.ge)
- `urgent` (boolean, optional) - Send as urgent message (default: `false`)

**Returns:** Promise resolving to `SmsSendResponse`

**Example:**

```typescript
const result = await sms.send('995555555555', 'Hello!', 'GOSMS.GE');
console.log('Message ID:', result.messageId);
console.log('Balance:', result.balance);

// Send urgent message
await sms.send('995555555555', 'Urgent alert!', 'GOSMS.GE', true);
```

### `sendOtp(phoneNumber: string): Promise<OtpSendResponse>`

Sends an OTP (One-Time Password) SMS message.

**Parameters:**

- `phoneNumber` (string, required) - Phone number to send OTP to

**Returns:** Promise resolving to `OtpSendResponse` with hash for verification

**Example:**

```typescript
const result = await sms.sendOtp('995555555555');
console.log('OTP Hash:', result.hash); // Save this for verification
console.log('Balance:', result.balance);
```

### `verifyOtp(phoneNumber: string, hash: string, code: string): Promise<OtpVerifyResponse>`

Verifies an OTP code sent to a phone number.

**Parameters:**

- `phoneNumber` (string, required) - Phone number that received the OTP
- `hash` (string, required) - Hash received from `sendOtp()` response
- `code` (string, required) - OTP code entered by the user

**Returns:** Promise resolving to `OtpVerifyResponse` with verify boolean

**Example:**

```typescript
const result = await sms.verifyOtp('995555555555', 'hash_from_sendOtp', '1234');
if (result.verify) {
  console.log('OTP verified successfully');
} else {
  console.log('Invalid OTP code');
}
```

### `status(messageId: string): Promise<CheckStatusResponse>`

Checks the delivery status of a sent SMS message.

**Parameters:**

- `messageId` (string, required) - Message ID received from `send()` response

**Returns:** Promise resolving to `CheckStatusResponse` with message status information

**Example:**

```typescript
const result = await sms.status('12345');
console.log('Status:', result.status); // e.g., 'delivered', 'pending', 'failed'
console.log('From:', result.from);
console.log('To:', result.to);
```

### `balance(): Promise<BalanceResponse>`

Checks the current SMS balance of your account.

**Returns:** Promise resolving to `BalanceResponse` with balance information

**Example:**

```typescript
const result = await sms.balance();
console.log('Balance:', result.balance); // Number of SMS credits remaining
```

### `createSender(name: string): Promise<SenderCreateResponse>`

Creates a new sender name for your account. Note: Sender names must be approved by GOSMS.ge before use.

**Parameters:**

- `name` (string, required) - Sender name to create (e.g., 'MyCompany', 'MyApp')

**Returns:** Promise resolving to `SenderCreateResponse`

**Example:**

```typescript
const result = await sms.createSender('MyCompany');
if (result.success) {
  console.log('Sender name created successfully');
  console.log('Note: Wait for approval before using it');
}
```

## Response Types

### `SmsSendResponse`

```typescript
{
  success: boolean;
  userId: string;
  messageId: number | string;
  from: string;
  to: string;
  text: string;
  balance: number;
  sendAt: Date;
  segment: number;
  smsCharacters: number;
  encode: string;
}
```

### `OtpSendResponse`

```typescript
{
  success: boolean;
  hash: string;
  balance: number;
  to: string;
  sendAt: Date;
  segment: number;
  smsCharacters: number;
  encode: string;
}
```

### `OtpVerifyResponse`

```typescript
{
  success: boolean;
  verify: boolean;
}
```

### `CheckStatusResponse`

```typescript
{
  success: boolean;
  messageId: number | string;
  from: string;
  to: string;
  text: string;
  status: string;
  sendAt: Date;
  segment: number;
  smsCharacters: number;
  encode: string;
}
```

### `BalanceResponse`

```typescript
{
  success: boolean;
  balance: number;
}
```

### `SenderCreateResponse`

```typescript
{
  success: boolean;
}
```

### `SmsError`

```typescript
{
  errorCode?: number;
  message?: string;
}
```

# Testing

This package includes a comprehensive test suite with 100% code coverage.

## Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:

- ✅ Constructor validation (API key requirements)
- ✅ SMS sending (regular and urgent messages)
- ✅ OTP sending and verification
- ✅ Message status checking
- ✅ Balance checking
- ✅ Sender name creation
- ✅ Input validation for all methods
- ✅ Error handling (API errors and network failures)

**Current Coverage: 100%** (statements, branches, functions, lines)

# Versioning & Releases

This project follows [Semantic Versioning](https://semver.org/) and uses automated releases via [semantic-release](https://github.com/semantic-release/semantic-release).

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- `feat:` - New features (triggers MINOR version bump)
- `fix:` - Bug fixes (triggers PATCH version bump)
- `BREAKING CHANGE:` - Breaking changes (triggers MAJOR version bump)

Example:

```bash
feat(sms): add support for scheduled messages
fix(validation): correct phone number format validation
```

## Automated Releases

Releases are automatically published when commits are pushed to the `master` branch:

1. CI runs tests on Node.js 18, 20, and 22
2. semantic-release analyzes commits since last release
3. Version is bumped based on commit types
4. CHANGELOG.md is automatically generated
5. Package is published to npm
6. GitHub release is created with release notes

For complete details, see [VERSIONING.md](./VERSIONING.md).

# Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on:

- Development workflow
- Commit message conventions
- Pull request process
- Testing requirements
- Code standards

Quick start for contributors:

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/gosmsge-node.git
cd gosmsge-node

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

# More info

You can check out our website https://www.gosms.ge
