"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS = void 0;
const axios_1 = require("axios");
const SMS = class SMS {
    constructor(api_key) {
        if (!api_key) {
            throw new TypeError('api_key is required');
        }
        if (typeof api_key !== 'string') {
            throw new TypeError('api_key is required to be a string');
        }
        this.apiKey = api_key;
        this.gateway_url = 'https://api.gosms.ge/api';
        this.action = null;
    }
    // send sms message
    send(phoneNumbers, text, senderName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (phoneNumbers) {
                if (typeof phoneNumbers !== 'string') {
                    throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number');
                }
            }
            else {
                throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number');
            }
            if (!text || typeof text != 'string') {
                throw new TypeError('Second argument text is required, it must be string');
            }
            if (!senderName || typeof senderName != 'string') {
                throw new TypeError('Third argument senderName is required, it must be string');
            }
            this.action = 'sendsms';
            try {
                const jsonDataObj = {
                    api_key: this.apiKey,
                    to: phoneNumbers,
                    from: senderName,
                    text: text
                };
                return yield axios_1.default.post(`${this.gateway_url}/${this.action}`, jsonDataObj, { headers: { 'Content-type': 'application/json' } })
                    .then((res) => res.data)
                    .catch((error) => {
                    throw error;
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    // send OTP sms message
    sendOtp(phoneNumbers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (phoneNumbers) {
                if (typeof phoneNumbers !== 'string') {
                    throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number');
                }
            }
            else {
                throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number');
            }
            this.action = 'otp/send';
            try {
                const jsonDataObj = {
                    api_key: this.apiKey,
                    phone: phoneNumbers
                };
                return yield axios_1.default.post(`${this.gateway_url}/${this.action}`, jsonDataObj, { headers: { 'Content-type': 'application/json' } })
                    .then((res) => res.data)
                    .catch((error) => {
                    throw error;
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    // verify OTP sms
    verifyOtp(phoneNumbers, hash, code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (phoneNumbers) {
                if (typeof phoneNumbers !== 'string') {
                    throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number');
                }
            }
            else {
                throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number');
            }
            if (!hash || typeof hash != 'string') {
                throw new TypeError('Second argument hash is required, it must be string');
            }
            if (!code || typeof code != 'string') {
                throw new TypeError('Third argument code is required, it must be string');
            }
            this.action = 'otp/verify';
            try {
                const jsonDataObj = {
                    api_key: this.apiKey,
                    phone: phoneNumbers,
                    hash: hash,
                    code: code
                };
                return yield axios_1.default.post(`${this.gateway_url}/${this.action}`, jsonDataObj, { headers: { 'Content-type': 'application/json' } })
                    .then((res) => res.data)
                    .catch((error) => {
                    throw error;
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    // check message status
    status(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!messageId) {
                throw new TypeError('Message Id is required, it should be string');
            }
            this.action = 'checksms';
            try {
                return yield axios_1.default.post(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}&messageId=${messageId}`, {}, { headers: { 'Content-type': 'application/json' } })
                    .then((res) => res.data)
                    .catch((error) => {
                    throw error;
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    // check balance
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            this.action = 'checkbalance';
            try {
                return yield axios_1.default.post(`${this.gateway_url}/${this.action}?api_key=${this.apiKey}`, {}, { headers: { 'Content-type': 'application/json' } })
                    .then((res) => res.data)
                    .catch((error) => {
                    throw error;
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
};
exports.SMS = SMS;
