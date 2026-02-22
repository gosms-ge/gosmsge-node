import {
  SMS,
  SmsSendResponse,
  SendBulkSmsResponse,
  OtpSendResponse,
  OtpVerifyResponse,
  CheckStatusResponse,
  BalanceResponse,
  SmsError,
  SenderCreateResponse,
  GoSmsErrorCode,
} from '../index';

// Mock global fetch
global.fetch = jest.fn();

describe('SMS Class', () => {
  const validApiKey = 'test_api_key_123';
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create an instance with valid API key', () => {
      const sms = new SMS(validApiKey);
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should throw TypeError if api_key is not provided', () => {
      expect(() => new SMS('' as any)).toThrow(TypeError);
      expect(() => new SMS('' as any)).toThrow('api_key is required');
    });

    it('should throw TypeError if api_key is not a string', () => {
      expect(() => new SMS(123 as any)).toThrow(TypeError);
      expect(() => new SMS(123 as any)).toThrow('api_key is required to be a string');
    });

    it('should throw TypeError if api_key is null', () => {
      expect(() => new SMS(null as any)).toThrow(TypeError);
    });

    it('should throw TypeError if api_key is undefined', () => {
      expect(() => new SMS(undefined as any)).toThrow(TypeError);
    });
  });

  describe('send() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should send SMS successfully with valid parameters', async () => {
      const mockResponse: SmsSendResponse = {
        success: true,
        messageId: 12345,
        from: 'GOSMS',
        to: '995555123456',
        text: 'Test message',
        sendAt: '2025-01-15T10:30:00.000Z',
        balance: 100,
        encode: 'default',
        segment: 1,
        smsCharacters: 12,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.send('995555123456', 'Test message', 'GOSMS');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/sendsms',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: validApiKey,
            to: '995555123456',
            from: 'GOSMS',
            text: 'Test message',
            urgent: false,
          }),
        })
      );
    });

    it('should send urgent SMS when urgent flag is true', async () => {
      const mockResponse: SmsSendResponse = {
        success: true,
        messageId: 12345,
        from: 'GOSMS',
        to: '995555123456',
        text: 'Urgent message',
        sendAt: '2025-01-15T10:30:00.000Z',
        balance: 100,
        encode: 'default',
        segment: 1,
        smsCharacters: 14,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await sms.send('995555123456', 'Urgent message', 'GOSMS', true);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/sendsms',
        expect.objectContaining({
          body: JSON.stringify({
            api_key: validApiKey,
            to: '995555123456',
            from: 'GOSMS',
            text: 'Urgent message',
            urgent: true,
          }),
        })
      );
    });

    it('should throw TypeError if phoneNumber is not provided', async () => {
      await expect(sms.send('', 'Test', 'GOSMS')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if phoneNumber is not a string', async () => {
      await expect(sms.send(123 as any, 'Test', 'GOSMS')).rejects.toThrow(TypeError);
      await expect(sms.send(123 as any, 'Test', 'GOSMS')).rejects.toThrow(
        'phoneNumber is required'
      );
    });

    it('should throw TypeError if text is not provided', async () => {
      await expect(sms.send('995555123456', '', 'GOSMS')).rejects.toThrow(TypeError);
      await expect(sms.send('995555123456', '', 'GOSMS')).rejects.toThrow(
        'Second argument text is required'
      );
    });

    it('should throw TypeError if text is not a string', async () => {
      await expect(sms.send('995555123456', 123 as any, 'GOSMS')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if senderName is not provided', async () => {
      await expect(sms.send('995555123456', 'Test', '')).rejects.toThrow(TypeError);
      await expect(sms.send('995555123456', 'Test', '')).rejects.toThrow(
        'Third argument senderName is required'
      );
    });

    it('should throw TypeError if senderName is not a string', async () => {
      await expect(sms.send('995555123456', 'Test', 123 as any)).rejects.toThrow(TypeError);
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.INVALID_API_KEY,
        message: 'Invalid or missing API key',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(sms.send('995555123456', 'Test', 'GOSMS')).rejects.toEqual(mockError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(sms.send('995555123456', 'Test', 'GOSMS')).rejects.toThrow('Network error');
    });
  });

  describe('sendOtp() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should send OTP successfully', async () => {
      const mockResponse: OtpSendResponse = {
        success: true,
        hash: 'abc123hash',
        balance: 100,
        to: '995555123456',
        sendAt: '2025-01-15T10:30:00.000Z',
        encode: 'default',
        segment: 1,
        smsCharacters: 20,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.sendOtp('995555123456');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/otp/send',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: validApiKey,
            phone: '995555123456',
          }),
        })
      );
    });

    it('should throw TypeError if phoneNumber is not provided', async () => {
      await expect(sms.sendOtp('' as any)).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if phoneNumber is not a string', async () => {
      await expect(sms.sendOtp(123 as any)).rejects.toThrow(TypeError);
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.INVALID_PHONE,
        message: 'Invalid phone number format',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(sms.sendOtp('995555123456')).rejects.toEqual(mockError);
    });
  });

  describe('verifyOtp() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should verify OTP successfully', async () => {
      const mockResponse: OtpVerifyResponse = {
        success: true,
        verify: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.verifyOtp('995555123456', 'abc123hash', '1234');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/otp/verify',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: validApiKey,
            phone: '995555123456',
            hash: 'abc123hash',
            code: '1234',
          }),
        })
      );
    });

    it('should return verify: false for invalid OTP', async () => {
      const mockResponse: OtpVerifyResponse = {
        success: true,
        verify: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.verifyOtp('995555123456', 'abc123hash', '9999');

      expect(result).toEqual(mockResponse);
      expect((result as OtpVerifyResponse).verify).toBe(false);
    });

    it('should throw TypeError if phoneNumber is not provided', async () => {
      await expect(sms.verifyOtp('' as any, 'hash', '1234')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if phoneNumber is not a string', async () => {
      await expect(sms.verifyOtp(123 as any, 'hash', '1234')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if hash is not provided', async () => {
      await expect(sms.verifyOtp('995555123456', '' as any, '1234')).rejects.toThrow(TypeError);
      await expect(sms.verifyOtp('995555123456', '' as any, '1234')).rejects.toThrow(
        'Second argument hash is required'
      );
    });

    it('should throw TypeError if hash is not a string', async () => {
      await expect(sms.verifyOtp('995555123456', 123 as any, '1234')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if code is not provided', async () => {
      await expect(sms.verifyOtp('995555123456', 'hash', '' as any)).rejects.toThrow(TypeError);
      await expect(sms.verifyOtp('995555123456', 'hash', '' as any)).rejects.toThrow(
        'Third argument code is required'
      );
    });

    it('should throw TypeError if code is not a string', async () => {
      await expect(sms.verifyOtp('995555123456', 'hash', 1234 as any)).rejects.toThrow(TypeError);
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.OTP_EXPIRED,
        message: 'OTP expired',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(sms.verifyOtp('995555123456', 'hash', '1234')).rejects.toEqual(mockError);
    });
  });

  describe('status() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should check message status successfully', async () => {
      const mockResponse: CheckStatusResponse = {
        success: true,
        messageId: 12345,
        from: 'GOSMS',
        to: '995555123456',
        text: 'Test message',
        encode: 'default',
        sendAt: '2025-01-15T10:30:00.000Z',
        segment: 1,
        smsCharacters: 12,
        status: 'DELIVERED',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.status('12345');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/checksms',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: validApiKey,
            messageId: '12345',
          }),
        })
      );
    });

    it('should throw TypeError if messageId is not provided', async () => {
      await expect(sms.status('')).rejects.toThrow(TypeError);
      await expect(sms.status('')).rejects.toThrow('Message Id is required, it must be a string');
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.MESSAGE_NOT_FOUND,
        message: 'Message not found',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(sms.status('12345')).rejects.toEqual(mockError);
    });
  });

  describe('balance() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should check balance successfully', async () => {
      const mockResponse: BalanceResponse = {
        success: true,
        balance: 150.5,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.balance();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/sms-balance',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: validApiKey,
          }),
        })
      );
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.INVALID_API_KEY,
        message: 'Invalid or missing API key',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(sms.balance()).rejects.toEqual(mockError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection timeout'));

      await expect(sms.balance()).rejects.toThrow('Connection timeout');
    });
  });

  describe('createSender() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should create sender name successfully', async () => {
      const mockResponse: SenderCreateResponse = {
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.createSender('MyCompany');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/sender',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: validApiKey,
            name: 'MyCompany',
          }),
        })
      );
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.SENDER_EXISTS,
        message: 'Sender name already exists',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(sms.createSender('ExistingSender')).rejects.toEqual(mockError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API unavailable'));

      await expect(sms.createSender('MyCompany')).rejects.toThrow('API unavailable');
    });
  });

  describe('sendBulk() method', () => {
    let sms: InstanceType<typeof SMS>;

    beforeEach(() => {
      sms = new SMS(validApiKey);
    });

    it('should send bulk SMS successfully', async () => {
      const mockResponse: SendBulkSmsResponse = {
        success: true,
        totalCount: 2,
        successCount: 2,
        failedCount: 0,
        balance: 98,
        from: 'GOSMS',
        text: 'Bulk message',
        encode: 'default',
        segment: 1,
        smsCharacters: 12,
        messages: [
          { messageId: 100, to: '995555111111', success: true },
          { messageId: 101, to: '995555222222', success: true },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.sendBulk('GOSMS', ['995555111111', '995555222222'], 'Bulk message');

      expect(result).toEqual(mockResponse);
      expect(result.totalCount).toBe(2);
      expect(result.successCount).toBe(2);
      expect(result.messages).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/sendbulk',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            api_key: validApiKey,
            from: 'GOSMS',
            to: ['995555111111', '995555222222'],
            text: 'Bulk message',
            urgent: false,
          }),
        })
      );
    });

    it('should handle partial failures', async () => {
      const mockResponse: SendBulkSmsResponse = {
        success: true,
        totalCount: 2,
        successCount: 1,
        failedCount: 1,
        balance: 99,
        from: 'GOSMS',
        text: 'Test',
        encode: 'default',
        segment: 1,
        smsCharacters: 4,
        messages: [
          { messageId: 200, to: '995555111111', success: true },
          { messageId: 0, to: '995555000000', success: false, error: 'Blacklisted' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await sms.sendBulk('GOSMS', ['995555111111', '995555000000'], 'Test');

      expect(result.failedCount).toBe(1);
      expect(result.messages[1].success).toBe(false);
      expect(result.messages[1].error).toBe('Blacklisted');
    });

    it('should throw TypeError if senderName is not provided', async () => {
      await expect(sms.sendBulk('', ['995555111111'], 'Test')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if phoneNumbers is not an array', async () => {
      await expect(sms.sendBulk('GOSMS', '' as any, 'Test')).rejects.toThrow(TypeError);
      await expect(sms.sendBulk('GOSMS', '' as any, 'Test')).rejects.toThrow(
        'phoneNumbers is required'
      );
    });

    it('should throw TypeError if phoneNumbers is empty', async () => {
      await expect(sms.sendBulk('GOSMS', [], 'Test')).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if text is not provided', async () => {
      await expect(sms.sendBulk('GOSMS', ['995555111111'], '')).rejects.toThrow(TypeError);
    });

    it('should handle API error response', async () => {
      const mockError: SmsError = {
        errorCode: GoSmsErrorCode.INSUFFICIENT_BALANCE,
        message: 'Insufficient SMS balance',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(
        sms.sendBulk('GOSMS', ['995555111111'], 'Test')
      ).rejects.toEqual(mockError);
    });

    it('should include noSmsNumber when provided', async () => {
      const mockResponse: SendBulkSmsResponse = {
        success: true,
        totalCount: 1,
        successCount: 1,
        failedCount: 0,
        balance: 99,
        from: 'GOSMS',
        text: 'Ad',
        encode: 'default',
        segment: 1,
        smsCharacters: 2,
        messages: [{ messageId: 300, to: '995555111111', success: true }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await sms.sendBulk('GOSMS', ['995555111111'], 'Ad', false, '0000');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gosms.ge/api/sendbulk',
        expect.objectContaining({
          body: JSON.stringify({
            api_key: validApiKey,
            from: 'GOSMS',
            to: ['995555111111'],
            text: 'Ad',
            urgent: false,
            noSmsNumber: '0000',
          }),
        })
      );
    });
  });

  describe('Constructor options', () => {
    it('should accept debug option', () => {
      const sms = new SMS(validApiKey, { debug: true });
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should accept timeout option', () => {
      const sms = new SMS(validApiKey, { timeout: 5000 });
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should accept retries option', () => {
      const sms = new SMS(validApiKey, { retries: 3 });
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should accept all options together', () => {
      const sms = new SMS(validApiKey, { debug: true, timeout: 5000, retries: 3 });
      expect(sms).toBeInstanceOf(SMS);
    });
  });

  describe('Debug mode', () => {
    it('should log debug messages when debug is enabled', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const sms = new SMS(validApiKey, { debug: true });

      const mockResponse: BalanceResponse = {
        success: true,
        balance: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await sms.balance();

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls.some(call => call[0] === '[GOSMS Debug]')).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should not log when debug is disabled', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const sms = new SMS(validApiKey, { debug: false });

      const mockResponse: BalanceResponse = {
        success: true,
        balance: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await sms.balance();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
