interface ISMS {
    send(phoneNumbers: string | string[], text: string, senderName: string): Promise<any>;
    sendOtp(phoneNumbers: string): Promise<any>;
    verifyOtp(phoneNumbers: string, hash: string, code: string): Promise<any>;
    status(messageId: string): Promise<any>;
    balance(): Promise<any>;
}
declare class SMS implements ISMS {
    private readonly apiKey;
    private readonly gateway_url;
    private action;
    constructor(api_key: string);
    send(phoneNumbers: string | string[], text: string, senderName: string): Promise<any>;
    sendOtp(phoneNumbers: string): Promise<any>;
    verifyOtp(phoneNumbers: string, hash: string, code: string): Promise<any>;
    status(messageId: string): Promise<any>;
    balance(): Promise<any>;
}
export { SMS };
