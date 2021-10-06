const request = require('request-promise');
interface SMSInterface {
    new(api_key: string): ISMS;
}
interface ISMS {
    send(phoneNumbers: string | string[], text: string, senderName: string): Promise<any>;

    sendOtp(phoneNumbers: string): Promise<any>;

    verifyOtp(phoneNumbers: string, hash: string, code: string): Promise<any>;

    status(messageId: string): Promise<any>;

    balance(): Promise<any>;
}

export interface SmsSendResponse {
    success: boolean;
    userId: string;
    message_id: number;
    from: string;
    to: string;
    text: string;
    newService: boolean;
    msgCount: number;
    sendAt: Date;
    balance: number;
    encode: string;
    segment: number;
    smsCharacters: number;
}

export interface CheckStatusResponse {
    success: boolean;
    messageId: number;
    from: string;
    to: string;
    text: string;
    encode: string;
    sendAt: Date;
    segment: number;
    smsCharacters: number;
    status: string;
}

export interface BalanceResponse {
    success: boolean;
    balance: number;
}

const SMS: SMSInterface = class SMS implements ISMS {  // Main class
    private readonly apiKey: string
    private readonly gateway_url: string
    private action: string

    constructor(api_key: string) {
        if (!api_key) {
            throw new TypeError('api_key is required')
        }
        if (typeof api_key !== 'string') {
            throw new TypeError('api_key is required to be a string')
        }

        this.apiKey = api_key;
        this.gateway_url = 'https://api.gosms.ge/api';
        this.action = null;

    }


    // send sms message
    async send(phoneNumbers: string | string[], text: string, senderName: string): Promise<SmsSendResponse> {
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
                url: `${this.gateway_url}/${this.action}`,
                body: jsonDataObj,
                json: true
            }, (err, res, body) => {
                if (err) {
                    return err;
                }
                return body
            });
        } catch (err) {
            throw err
        }
    }

    // send OTP sms message
    async sendOtp(phoneNumbers: string): Promise<any> {
        if (phoneNumbers) {
            if (typeof phoneNumbers !== 'string') {
                throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
            }
        } else {
            throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
        }

        this.action = 'otp/send';
        try {
            const jsonDataObj = {
                api_key: this.apiKey,
                phone: phoneNumbers
            };
            return await request.post({
                url: `${this.gateway_url}/${this.action}`,
                body: jsonDataObj,
                json: true
            }, (err, res, body) => {
                if (err) {
                    return err;
                }
                return body
            });
        } catch (err) {
            throw err
        }
    }

    // verify OTP sms
    async verifyOtp(phoneNumbers: string, hash: string, code: string) {
        if (phoneNumbers) {
            if (typeof phoneNumbers !== 'string') {
                throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
            }
        } else {
            throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
        }
        if (!hash || typeof hash != 'string') {
            throw new TypeError('Second argument hash is required, it must be string')
        }
        if (!code || typeof code != 'string') {
            throw new TypeError('Third argument code is required, it must be string')
        }
        this.action = 'otp/verify';
        try {
            const jsonDataObj = {
                api_key: this.apiKey,
                phone: phoneNumbers,
                hash: hash,
                code: code
            };
            return await request.post({
                url: `${this.gateway_url}/${this.action}`,
                body: jsonDataObj,
                json: true
            }, (err, res, body) => {
                if (err) {
                    return err;
                }
                return body
            });
        } catch (err) {
            throw err
        }
    }

    // check message status
    async status(messageId: string): Promise<CheckStatusResponse> {
        if (!messageId) {
            throw new TypeError('Message Id is required, it should be string')
        }
        this.action = 'checksms';
        try {
            const response = await request(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}&messageId=${messageId}`, {json: true}, (err, res, body) => {
                if (err) {
                    return err;
                }
                return body
            });
            return response
        } catch (err) {
            throw err
        }
    }

    // check balance
    async balance(): Promise<BalanceResponse> {
        this.action = 'checkbalance';
        try {
            const response = await request(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}`, {json: true}, (err, res, body) => {
                if (err) {
                    return err;
                }
                return body
            });
            return response
        } catch (err) {
            throw err
        }
    }
}

export {SMS}