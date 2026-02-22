export type MessageId = number | string;
export type ErrorMessageCode = number;
export type ActionType =
  | 'sendsms'
  | 'sendbulk'
  | 'otp/send'
  | 'otp/verify'
  | 'checksms'
  | 'sms-balance'
  | 'sender';

export const GoSmsErrorCode = {
  INVALID_API_KEY: 100,
  INVALID_SENDER: 101,
  INSUFFICIENT_BALANCE: 102,
  INVALID_PARAMETERS: 103,
  MESSAGE_NOT_FOUND: 104,
  INVALID_PHONE: 105,
  OTP_FAILED: 106,
  SENDER_EXISTS: 107,
  NOT_CONFIGURED: 108,
  TOO_MANY_REQUESTS: 109,
  ACCOUNT_LOCKED: 110,
  OTP_EXPIRED: 111,
  OTP_ALREADY_USED: 112,
  INVALID_NO_SMS_NUMBER: 113,
} as const;

export interface ISMS {
  send(
    phoneNumber: string,
    text: string,
    senderName: string,
    urgent?: boolean
  ): Promise<SmsSendResponse>;

  sendBulk(
    senderName: string,
    phoneNumbers: string[],
    text: string,
    urgent?: boolean,
    noSmsNumber?: string
  ): Promise<SendBulkSmsResponse>;

  sendOtp(phoneNumber: string): Promise<OtpSendResponse>;

  verifyOtp(phoneNumber: string, hash: string, code: string): Promise<OtpVerifyResponse>;

  status(messageId: string): Promise<CheckStatusResponse>;

  balance(): Promise<BalanceResponse>;

  createSender(name: string): Promise<SenderCreateResponse>;
}

export interface SmsSendResponse extends SmsError {
  success: boolean;
  messageId: number;
  from: string;
  to: string;
  text: string;
  sendAt: string;
  balance: number;
  encode: string;
  segment: number;
  smsCharacters: number;
}

export interface SendBulkSmsResponse extends SmsError {
  success: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  balance: number;
  from: string;
  text: string;
  encode: string;
  segment: number;
  smsCharacters: number;
  messages: BulkSmsResult[];
}

export interface BulkSmsResult {
  messageId: number;
  to: string;
  success: boolean;
  error?: string;
}

export interface CheckStatusResponse extends SmsError {
  success: boolean;
  messageId: number;
  from: string;
  to: string;
  text: string;
  encode: string;
  sendAt: string;
  segment: number;
  smsCharacters: number;
  status: string;
}

export interface BalanceResponse extends SmsError {
  success: boolean;
  balance: number;
}

export interface OtpSendResponse extends SmsError {
  success: boolean;
  hash: string;
  balance: number;
  to: string;
  sendAt: string;
  encode: string;
  segment: number;
  smsCharacters: number;
}

export interface OtpVerifyResponse extends SmsError {
  success: boolean;
  verify: boolean;
}

export interface SmsError {
  errorCode?: ErrorMessageCode;
  message?: string;
}

export interface SenderCreateResponse extends SmsError {
  success: boolean;
}
