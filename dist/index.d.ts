declare const request: any;
declare class SMS {
    apiKey: string;
    gateway_url: string;
    action: string;
    constructor(api_key: any);
    send(phoneNumbers: any, text: any, senderName: any): Promise<any>;
    sendOtp(phoneNumbers: any): Promise<any>;
    verifyOtp(phoneNumbers: any, hash: any, code: any): Promise<any>;
    status(messageId: any): Promise<any>;
    balance(): Promise<any>;
}
