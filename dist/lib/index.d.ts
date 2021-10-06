export declare type MessageId = number | string;
export declare type ErrorMessageCode = 100 | 101 | 102 | 103 | 104 | number;
export declare type ActionType = 'sendsms' | 'otp/send' | 'otp/verify' | 'checksms' | 'checkbalance';
export interface ISMS {
    send(phoneNumbers: string | string[], text: string, senderName: string): Promise<any>;
    sendOtp(phoneNumbers: string): Promise<any>;
    verifyOtp(phoneNumbers: string, hash: string, code: string): Promise<any>;
    status(messageId: string): Promise<any>;
    balance(): Promise<any>;
}
export interface SmsSendResponse {
    success: boolean;
    userId: string;
    message_id: MessageId;
    messageId: MessageId;
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
    message_id: MessageId;
    messageId: MessageId;
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
export interface OtpSendResponse {
    success: boolean;
    hash: string;
    balance: number;
    to: string;
    sendAt: Date;
    encode: string;
    segment: number;
    smsCharacters: number;
}
export interface OtpVerifyResponse {
    success: boolean;
    verify: boolean;
}
export interface SmsError {
    errorCode: ErrorMessageCode;
    message: string;
}
