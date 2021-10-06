import { BalanceResponse, CheckStatusResponse, ErrorMessageCode, ISMS, MessageId, OtpSendResponse, OtpVerifyResponse, SmsError, SmsSendResponse } from "./lib";
interface SMSInterface {
    new (api_key: string): ISMS;
}
declare const SMS: SMSInterface;
export { SMS, BalanceResponse, SmsSendResponse, CheckStatusResponse, OtpSendResponse, OtpVerifyResponse, SmsError, ErrorMessageCode, MessageId };
