export type MessageId = number | string;
export type ErrorMessageCode = number;
export type ActionType =
  | 'sendsms'
  | 'otp/send'
  | 'otp/verify'
  | 'checksms'
  | 'sms-balance'
  | 'sender';

export interface ISMS {
  send(
    phoneNumbers: string | string[],
    text: string,
    senderName: string,
    urgent?: boolean
  ): Promise<SmsSendResponse | SmsError>;

  sendOtp(phoneNumbers: string): Promise<OtpSendResponse | SmsError>;

  verifyOtp(
    phoneNumbers: string,
    hash: string,
    code: string
  ): Promise<OtpVerifyResponse | SmsError>;

  status(messageId: string): Promise<CheckStatusResponse | SmsError>;

  balance(): Promise<BalanceResponse | SmsError>;

  createSender(name: string): Promise<SenderCreateResponse | SmsError>;
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

export interface SenderCreateResponse {
  success: boolean;
}
