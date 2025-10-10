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
