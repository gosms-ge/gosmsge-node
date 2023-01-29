import axios, {AxiosError, AxiosResponse} from "axios";
import {
    ActionType, BalanceResponse,
    CheckStatusResponse,
    ErrorMessageCode,
    ISMS,
    MessageId,
    OtpSendResponse,
    OtpVerifyResponse, SenderCreateResponse,
    SmsError,
    SmsSendResponse
} from "./lib";

interface SMSInterface {
    new(api_key: string): ISMS;
}


const SMS: SMSInterface = class SMS implements ISMS {  // Main class
    private readonly apiKey: string
    private readonly gateway_url: string
    private action: ActionType

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
    async send(phoneNumbers: string | string[], text: string, senderName: string): Promise<SmsSendResponse | SmsError> {
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
            return await axios.post<any>(`${this.gateway_url}/${this.action}`, jsonDataObj, {headers: {'Content-type': 'application/json'}})
                .then((res: AxiosResponse<SmsSendResponse>) => res.data)
                .catch((error: AxiosError<SmsError>) => {
                    throw error
                });
        } catch (err) {
            throw err
        }
    }

    // send OTP sms message
    async sendOtp(phoneNumbers: string): Promise<OtpSendResponse | SmsError> {
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
            return await axios.post<any>(`${this.gateway_url}/${this.action}`, jsonDataObj, {headers: {'Content-type': 'application/json'}})
                .then((res: AxiosResponse<OtpSendResponse>) => res.data)
                .catch((error: AxiosError<SmsError>) => {
                    throw error
                });
        } catch (err) {
            throw err
        }
    }

    // verify OTP sms
    async verifyOtp(phoneNumbers: string, hash: string, code: string): Promise<OtpVerifyResponse | SmsError> {
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
            return await axios.post<any>(`${this.gateway_url}/${this.action}`, jsonDataObj, {headers: {'Content-type': 'application/json'}})
                .then((res: AxiosResponse<OtpVerifyResponse>) => res.data)
                .catch((error: AxiosError<SmsError>) => {
                    throw error
                });
        } catch (err) {
            throw err
        }
    }

    // check message status
    async status(messageId: string): Promise<CheckStatusResponse | SmsError> {
        if (!messageId) {
            throw new TypeError('Message Id is required, it should be string')
        }
        this.action = 'checksms';
        try {
            return await axios.post<any>(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}&messageId=${messageId}`, {}, {headers: {'Content-type': 'application/json'}})
                .then((res: AxiosResponse<CheckStatusResponse>) => res.data)
                .catch((error: AxiosError<SmsError>) => {
                    throw error
                });
        } catch (err) {
            throw err
        }
    }

    // check balance
    async balance(): Promise<BalanceResponse | SmsError> {
        this.action = 'checkbalance';
        try {
            return await axios.post<any>(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}`, {}, {headers: {'Content-type': 'application/json'}})
                .then((res: AxiosResponse<BalanceResponse>) => res.data)
                .catch((error: AxiosError<SmsError>) => {
                    throw error
                });
        } catch (err) {
            throw err
        }
    }

    // create sender name
    createSender(name: string): Promise<SenderCreateResponse | SmsError> {
        this.action = 'sender';
        try {
            return axios.post<any>(`${this.gateway_url}/${this.action}`, {
                api_key: this.apiKey,
                name: name
            }, {headers: {'Content-type': 'application/json'}})
                .then((res: AxiosResponse<any>) => res.data)
                .catch((error: AxiosError<SmsError>) => {
                    throw error
                });
        } catch (err) {
            throw err
        }
    }
}

export {
    SMS,
    BalanceResponse,
    SmsSendResponse,
    CheckStatusResponse,
    OtpSendResponse,
    OtpVerifyResponse,
    SmsError,
    ErrorMessageCode,
    MessageId
}
