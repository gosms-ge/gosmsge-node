# GOSMS.GE Node JS SMS Send

Node JS client module to send SMS messages using GOSMS.GE SMS Gateway.

To use this library, you must have a valid account on https://gosms.ge.

**Please note** SMS messages sent with this library will be deducted by your GOSMS.GE account credits.

For any questions, please contact us at info@gosms.ge

# Installation

```bash
$ npm install gosmsge-node --save
```

# Send a message with Classic type

```js
const SMS = require('gosmsge-node')

const sms = new SMS('api_key')

sms.send('995555555555', 'Hello!',  'GOSMS.GE')
  .then(body => console.log(body)) // returns {"code": string,"message": string,"message_id": number,"balance": number,"user": string}
  .catch(err => console.log(err.message))
```

# Check status of message

```js
const SMS = require('gosmsge-node')

const sms = new SMS('api_key')

sms.status('message_id')
  .then(body => console.log(body)) // returns { id: number,sender: string,receiver: string,message: string',message_id: string,amount: number,status: string }
  .catch(err => console.log(err.message))
```

# Check balance

```js
const SMS = require('gosmsge-node')

const sms = new SMS('api_key')

sms.balance()
  .then(body => console.log(body)) // returns { balance: number, user: string }
  .catch(err => console.log(err.message))
```

# More info

You can check out our website https://www.gosms.ge
