import {
  BalanceResponse,
  CheckStatusResponse,
  ErrorMessageCode,
  ISMS,
  MessageId,
  OtpSendResponse,
  OtpVerifyResponse,
  SenderCreateResponse,
  SmsError,
  SmsSendResponse,
} from './lib';

interface SMSInterface {
  new (api_key: string, options?: SMSOptions): ISMS;
}

interface SMSOptions {
  debug?: boolean;
  timeout?: number;
  retries?: number;
}

const SMS: SMSInterface = class SMS implements ISMS {
  private readonly apiKey: string;
  private readonly gateway_url: string;
  private readonly debug: boolean;
  private readonly timeout: number;
  private readonly retries: number;

  /**
   * Creates a new SMS client instance
   * @param api_key - Your API key from https://gosms.ge
   * @param options - Optional configuration options
   * @param options.debug - Enable debug logging (default: false)
   * @param options.timeout - Request timeout in milliseconds (default: 30000)
   * @param options.retries - Number of retry attempts for failed requests (default: 1)
   * @throws {TypeError} If api_key is not provided or not a string
   * @example
   * ```typescript
   * const sms = new SMS('your_api_key');
   * // With options
   * const smsDebug = new SMS('your_api_key', { debug: true, retries: 3 });
   * ```
   */
  constructor(api_key: string, options: SMSOptions = {}) {
    if (!api_key) {
      throw new TypeError('api_key is required');
    }
    if (typeof api_key !== 'string') {
      throw new TypeError('api_key is required to be a string');
    }

    this.apiKey = api_key;
    this.gateway_url = 'https://api.gosms.ge/api';
    this.debug = options.debug || false;
    this.timeout = options.timeout || 30000;
    this.retries = options.retries !== undefined ? options.retries : 1;
  }

  /**
   * Internal logging method for debug mode
   * @private
   */
  private log(...args: unknown[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log('[GOSMS Debug]', ...args);
    }
  }

  /**
   * Validates phone number parameter
   * @private
   */
  private validatePhoneNumber(phoneNumber: unknown, paramName: string): void {
    if (!phoneNumber) {
      throw new TypeError(`${paramName} is required, it must be a string`);
    }
    if (typeof phoneNumber !== 'string') {
      throw new TypeError(`${paramName} is required, it must be a string`);
    }
  }

  /**
   * Validates string parameter
   * @private
   */
  private validateString(value: unknown, paramName: string, position: string): void {
    if (!value || typeof value !== 'string') {
      throw new TypeError(`${position} argument ${paramName} is required, it must be string`);
    }
  }

  /**
   * Delay helper for retry logic
   * @private
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Centralized HTTP request handler with retry logic
   * @private
   */
  private async makeRequest<T>(
    endpoint: string,
    data: Record<string, unknown>,
    method: 'GET' | 'POST' = 'POST'
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        this.log(`Request attempt ${attempt}/${this.retries} to ${endpoint}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(`${this.gateway_url}/${endpoint}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseData = (await response.json()) as T | SmsError;

        if (!response.ok) {
          this.log(`Request failed with status ${response.status}:`, responseData);
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw responseData;
        }

        this.log('Request successful:', responseData);
        return responseData as T;
      } catch (err) {
        lastError = err;
        this.log(`Attempt ${attempt} failed:`, err);

        if (attempt < this.retries) {
          const delayMs = Math.pow(2, attempt - 1) * 1000;
          this.log(`Retrying in ${delayMs}ms...`);
          await this.delay(delayMs);
        }
      }
    }

    throw lastError;
  }

  /**
   * Sends an SMS message to a phone number
   * @param phoneNumber - Phone number as a string
   * @param text - Message text to send
   * @param senderName - Sender name (must be pre-registered on GOSMS.ge)
   * @param urgent - Send as urgent message (default: false)
   * @returns Promise resolving to send response or error
   * @throws {TypeError} If parameters are invalid
   * @example
   * ```typescript
   * const result = await sms.send('995555123456', 'Hello!', 'GOSMS.GE');
   * console.log('Message ID:', result.messageId);
   *
   * // Send urgent message
   * await sms.send('995555123456', 'Urgent alert!', 'GOSMS.GE', true);
   * ```
   */
  async send(
    phoneNumber: string,
    text: string,
    senderName: string,
    urgent: boolean = false
  ): Promise<SmsSendResponse> {
    this.validatePhoneNumber(phoneNumber, 'phoneNumber');
    this.validateString(text, 'text', 'Second');
    this.validateString(senderName, 'senderName', 'Third');

    return this.makeRequest<SmsSendResponse>('sendsms', {
      api_key: this.apiKey,
      to: phoneNumber,
      from: senderName,
      text: text,
      urgent: urgent,
    });
  }

  /**
   * Sends an OTP (One-Time Password) SMS message
   * @param phoneNumber - Phone number to send OTP to
   * @returns Promise resolving to OTP send response with hash for verification
   * @throws {TypeError} If phoneNumber parameter is invalid
   * @example
   * ```typescript
   * const result = await sms.sendOtp('995555123456');
   * console.log('OTP Hash:', result.hash); // Save this for verification
   * console.log('Balance:', result.balance);
   * ```
   */
  async sendOtp(phoneNumber: string): Promise<OtpSendResponse> {
    this.validatePhoneNumber(phoneNumber, 'phoneNumber');

    return this.makeRequest<OtpSendResponse>('otp/send', {
      api_key: this.apiKey,
      phone: phoneNumber,
    });
  }

  /**
   * Verifies an OTP code sent to a phone number
   * @param phoneNumber - Phone number that received the OTP
   * @param hash - Hash received from sendOtp() response
   * @param code - OTP code entered by the user
   * @returns Promise resolving to verification result with verify boolean
   * @throws {TypeError} If any parameter is invalid
   * @example
   * ```typescript
   * const result = await sms.verifyOtp('995555123456', 'hash_from_sendOtp', '1234');
   * if (result.verify) {
   *   console.log('OTP verified successfully');
   * } else {
   *   console.log('Invalid OTP code');
   * }
   * ```
   */
  async verifyOtp(phoneNumber: string, hash: string, code: string): Promise<OtpVerifyResponse> {
    this.validatePhoneNumber(phoneNumber, 'phoneNumber');
    this.validateString(hash, 'hash', 'Second');
    this.validateString(code, 'code', 'Third');

    return this.makeRequest<OtpVerifyResponse>('otp/verify', {
      api_key: this.apiKey,
      phone: phoneNumber,
      hash: hash,
      code: code,
    });
  }

  /**
   * Checks the delivery status of a sent SMS message
   * @param messageId - Message ID received from send() response
   * @returns Promise resolving to message status information
   * @throws {TypeError} If messageId is not provided
   * @example
   * ```typescript
   * const result = await sms.status('12345');
   * console.log('Status:', result.status); // e.g., 'delivered', 'pending', 'failed'
   * console.log('From:', result.from);
   * console.log('To:', result.to);
   * ```
   */
  async status(messageId: string): Promise<CheckStatusResponse> {
    if (!messageId) {
      throw new TypeError('Message Id is required, it must be a string');
    }

    return this.makeRequest<CheckStatusResponse>('checksms', {
      api_key: this.apiKey,
      messageId: messageId,
    });
  }

  /**
   * Checks the current SMS balance of your account
   * @returns Promise resolving to balance information
   * @example
   * ```typescript
   * const result = await sms.balance();
   * console.log('Balance:', result.balance); // Number of SMS credits remaining
   * ```
   */
  async balance(): Promise<BalanceResponse> {
    return this.makeRequest<BalanceResponse>(`sms-balance?api_key=${this.apiKey}`, {});
  }

  /**
   * Creates a new sender name for your account
   * Note: Sender names must be approved by GOSMS.ge before use
   * @param name - Sender name to create (e.g., 'MyCompany', 'MyApp')
   * @returns Promise resolving to creation success response
   * @throws {TypeError} If name parameter is invalid
   * @example
   * ```typescript
   * const result = await sms.createSender('MyCompany');
   * if (result.success) {
   *   console.log('Sender name created successfully');
   *   console.log('Note: Wait for approval before using it');
   * }
   * ```
   */
  async createSender(name: string): Promise<SenderCreateResponse> {
    return this.makeRequest<SenderCreateResponse>('sender', {
      api_key: this.apiKey,
      name: name,
    });
  }
};

export {
  SMS,
  ISMS,
  BalanceResponse,
  SmsSendResponse,
  CheckStatusResponse,
  OtpSendResponse,
  OtpVerifyResponse,
  SenderCreateResponse,
  SmsError,
  ErrorMessageCode,
  MessageId,
};
