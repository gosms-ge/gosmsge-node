![Node.js Package](https://github.com/gosms-ge/gosmsge-node/workflows/Node.js%20Package/badge.svg)
[![CircleCI](https://circleci.com/gh/gosms-ge/gosmsge-node.svg?style=shield)](https://circleci.com/gh/gosms-ge/gosmsge-node)

# GOSMS.GE Node JS SMS Send

Node JS client module to send SMS messages using GOSMS.GE SMS Gateway.

To use this library, you must have a valid account on https://gosms.ge.

**Please note** SMS messages sent with this library will be deducted by your GOSMS.GE account credits.

For any questions, please contact us at info@gosms.ge

# Installation

```bash
$ npm install @gosmsge/gosmsge-node --save
```

# Send a message with Classic type

```js
const SMS = require('@gosmsge/gosmsge-node')

const sms = new SMS('api_key')

sms.send('995555555555', 'Hello!',  'GOSMS.GE')
  .then(body => console.log(body)) // returns {"code": string,"message": string,"message_id": number,"balance": number,"user": string}
  .catch(err => console.log(err.message))
```

# Check status of message

```js
const SMS = require('@gosmsge/gosmsge-node')

const sms = new SMS('api_key')

sms.status('message_id')
  .then(body => console.log(body)) // returns { id: number,sender: string,receiver: string,message: string',message_id: string,amount: number,status: string }
  .catch(err => console.log(err.message))
```

# Check balance

```js
const SMS = require('@gosmsge/gosmsge-node')

const sms = new SMS('api_key')

sms.balance()
  .then(body => console.log(body)) // returns { balance: number, user: string }
  .catch(err => console.log(err.message))
```

OTP SMS send
```js
const SMS = require('@gosmsge/gosmsge-node')

const sms = new SMS('api_key')

sms.sendOtp('995555555555')
  .then(body => console.log(body)) 
  .catch(err => console.log(err.message))
```
Response
```js
{
  "success": true,
  "hash": "hashkey",
  "to": "995123456789",
  "sendAt": "2020-05-24T09:56:02.449Z",
  "encode": "default",
  "segment": 1,
  "smsCharacters": 57
}
```

OTP SMS verification

```js
const SMS = require('@gosmsge/gosmsge-node')

const sms = new SMS('api_key')

sms.verifyOtp('995555555555', '23423uhe784375yf234n59', 1234) // phone number, hash, code
  .then(body => console.log(body)) 
  .catch(err => console.log(err.message))
```
Response
```js
{
  "success": true,
  "verify": true
}
```

# More info

You can check out our website https://www.gosms.ge

