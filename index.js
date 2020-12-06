const request = require('request-promise');

class SMS {  // Main class
    constructor(api_key) {
        if (!api_key) {
            throw new TypeError('api_key is required')
        }
        if (typeof api_key !== 'string') {
            throw new TypeError('api_key is required to be a string')
        }

        this.apiKey = api_key;
        this.gateway_url= 'https://api.gosms.ge/api';
        this.action = null;

    }

    // send sms message
    async send(phoneNumbers, text, senderName) {
        if (phoneNumbers) {
            if (typeof phoneNumbers !== 'string') {
                throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
            }
        } else {
            throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
        }
        if (!text || typeof text != 'string') {
            throw new TypeError('Second argument text is required, it must be string')
        }

        if (!senderName || typeof senderName != 'string') {
            throw new TypeError('Third argument senderName is required, it must be string')
        }
        this.action = 'sendsms';
        try {
            const jsonDataObj = {
                api_key: this.apiKey,
                to: phoneNumbers,
                from: senderName,
                text: text
            };
            return await request.post({
                url:     `${this.gateway_url}/${this.action}`,
                body: jsonDataObj,
                json: true
            }, (err, res, body) => {
                if (err) { return err; }
                return body
            });
        } catch (err) {
            throw err
        }
    }

    // check message status
    async status(messageId) {
        if (!messageId) {
            throw new TypeError('Message Id is required, it should be string')
        }
        this.action = 'checksms';
        try {
            const response = await request(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}&messageId=${messageId}`, { json: true }, (err, res, body) => {
                if (err) { return err; }
                return body
            });
            return response
        } catch (err) {
            throw err
        }
    }

    // check balance
    async balance() {
        this.action = 'checkbalance';
        try {
            const response = await request(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}`, { json: true }, (err, res, body) => {
                if (err) { return err; }
                return body
            });
            return response
        } catch (err) {
            throw err
        }
    }
}

module.exports = SMS;
