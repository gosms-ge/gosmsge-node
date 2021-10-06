interface SMSInterface {
    new (api_key: string): ISMS;
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
declare const SMS: SMSInterface;
export { SMS };
