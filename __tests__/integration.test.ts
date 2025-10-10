import {
  SMS,
  SmsSendResponse,
  OtpSendResponse,
  OtpVerifyResponse,
  CheckStatusResponse,
  BalanceResponse,
  SmsError,
} from '../index';

/**
 * Integration Tests
 *
 * These tests demonstrate integration scenarios and can optionally run against
 * the real GOSMS.ge API if GOSMS_API_KEY environment variable is provided.
 *
 * To run with real API:
 *   GOSMS_API_KEY=your_key npm test
 *
 * Without API key, tests are skipped.
 */

// Mock global fetch
global.fetch = jest.fn();

// Helper to create properly typed mock Response
function createMockResponse<T>(data: T, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    json: async () => data,
    text: jest.fn(),
    bytes: jest.fn(),
  } as Response;
}

describe('Integration Tests', () => {
  const apiKey = process.env.GOSMS_API_KEY;
  const hasApiKey = !!apiKey;

  // Helper to skip tests if no API key
  const testWithApi = hasApiKey ? it : it.skip;

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  describe('Real API Integration (optional)', () => {
    testWithApi('should check balance with real API', async () => {
      const sms = new SMS(apiKey!);
      const result = await sms.balance();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('balance');
      expect(typeof (result as BalanceResponse).balance).toBe('number');
      expect((result as BalanceResponse).success).toBe(true);
    }, 30000);

    testWithApi('should handle invalid API key gracefully', async () => {
      const sms = new SMS('invalid_api_key_12345');

      await expect(sms.balance()).rejects.toMatchObject({
        errorCode: expect.any(Number),
        message: expect.any(String),
      });
    }, 30000);

    testWithApi('should handle network timeout', async () => {
      const sms = new SMS(apiKey!, { timeout: 1 }); // 1ms timeout

      await expect(sms.balance()).rejects.toThrow();
    }, 30000);
  });

  describe('Configuration Integration', () => {
    it('should create client with debug mode', () => {
      const sms = new SMS('test_key', { debug: true });
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should create client with custom timeout', () => {
      const sms = new SMS('test_key', { timeout: 5000 });
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should create client with retry configuration', () => {
      const sms = new SMS('test_key', { retries: 3 });
      expect(sms).toBeInstanceOf(SMS);
    });

    it('should create client with all options', () => {
      const sms = new SMS('test_key', {
        debug: true,
        timeout: 10000,
        retries: 2,
      });
      expect(sms).toBeInstanceOf(SMS);
    });
  });

  describe('Error Scenarios', () => {
    let sms: InstanceType<typeof SMS>;
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
      sms = new SMS('test_api_key');
      jest.clearAllMocks();
    });

    it('should handle API error responses correctly', async () => {
      const mockError: SmsError = {
        errorCode: 101,
        message: 'Invalid API key',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockError, false));

      await expect(sms.send('995555123456', 'Test', 'GOSMS')).rejects.toEqual(mockError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(sms.send('995555123456', 'Test', 'GOSMS')).rejects.toThrow(
        'Network failure'
      );
    });

    it('should handle timeout errors', async () => {
      const sms = new SMS('test_key', { timeout: 100 });

      let timerId: NodeJS.Timeout;
      mockFetch.mockImplementationOnce(
        (_url, options) =>
          new Promise((resolve, reject) => {
            const signal = options?.signal as AbortSignal;
            if (signal) {
              signal.addEventListener('abort', () => {
                clearTimeout(timerId);
                reject(new Error('The operation was aborted'));
              });
            }
            // Simulate a long-running request
            timerId = setTimeout(() => resolve(createMockResponse({})), 1000);
          })
      );

      await expect(sms.send('995555123456', 'Test', 'GOSMS')).rejects.toThrow();
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        json: async () => {
          throw new SyntaxError('Invalid JSON');
        },
        text: jest.fn(),
        bytes: jest.fn(),
      } as Response);

      await expect(sms.send('995555123456', 'Test', 'GOSMS')).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Retry Logic Integration', () => {
    let sms: InstanceType<typeof SMS>;
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('should succeed on first attempt when retry is configured', async () => {
      sms = new SMS('test_key', { retries: 3 });

      const mockResponse: SmsSendResponse = {
        success: true,
        userId: 'user123',
        message_id: '12345',
        messageId: '12345',
        from: 'GOSMS',
        to: '995555123456',
        text: 'Test',
        newService: false,
        msgCount: 1,
        sendAt: new Date(),
        balance: 100,
        encode: 'UTF-8',
        segment: 1,
        smsCharacters: 4,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await sms.send('995555123456', 'Test', 'GOSMS');
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on first failure and succeed on second attempt', async () => {
      sms = new SMS('test_key', { retries: 3, debug: false });

      const mockResponse: SmsSendResponse = {
        success: true,
        userId: 'user123',
        message_id: '12345',
        messageId: '12345',
        from: 'GOSMS',
        to: '995555123456',
        text: 'Test',
        newService: false,
        msgCount: 1,
        sendAt: new Date(),
        balance: 100,
        encode: 'UTF-8',
        segment: 1,
        smsCharacters: 4,
      };

      // First call fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Second call succeeds
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const promise = sms.send('995555123456', 'Test', 'GOSMS');

      // Fast-forward through retry delay
      await jest.runAllTimersAsync();

      const result = await promise;
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Complete Workflow Integration', () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should complete full SMS sending workflow', async () => {
      const sms = new SMS('test_key');

      // 1. Check balance
      const balanceResponse: BalanceResponse = {
        success: true,
        balance: 100,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(balanceResponse));

      const balance = await sms.balance();
      expect((balance as BalanceResponse).balance).toBeGreaterThan(0);

      // 2. Send SMS
      const sendResponse: SmsSendResponse = {
        success: true,
        userId: 'user123',
        message_id: '12345',
        messageId: '12345',
        from: 'GOSMS',
        to: '995555123456',
        text: 'Test workflow',
        newService: false,
        msgCount: 1,
        sendAt: new Date(),
        balance: 99,
        encode: 'UTF-8',
        segment: 1,
        smsCharacters: 13,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(sendResponse));

      const sendResult = await sms.send('995555123456', 'Test workflow', 'GOSMS');
      const messageId = (sendResult as SmsSendResponse).messageId;
      expect(messageId).toBeDefined();

      // 3. Check status
      const statusResponse: CheckStatusResponse = {
        success: true,
        message_id: '12345',
        messageId: '12345',
        from: 'GOSMS',
        to: '995555123456',
        text: 'Test workflow',
        encode: 'UTF-8',
        sendAt: new Date(),
        segment: 1,
        smsCharacters: 13,
        status: 'delivered',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(statusResponse));

      const status = await sms.status(messageId.toString());
      expect((status as CheckStatusResponse).status).toBeDefined();
    });

    it('should complete full OTP workflow', async () => {
      const sms = new SMS('test_key');

      // 1. Send OTP
      const otpSendResponse: OtpSendResponse = {
        success: true,
        hash: 'test_hash_123',
        balance: 100,
        to: '995555123456',
        sendAt: new Date(),
        encode: 'UTF-8',
        segment: 1,
        smsCharacters: 20,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(otpSendResponse));

      const otpResult = await sms.sendOtp('995555123456');
      const hash = (otpResult as OtpSendResponse).hash;
      expect(hash).toBeDefined();

      // 2. Verify OTP
      const otpVerifyResponse: OtpVerifyResponse = {
        success: true,
        verify: true,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(otpVerifyResponse));

      const verifyResult = await sms.verifyOtp('995555123456', hash, '1234');
      expect((verifyResult as OtpVerifyResponse).verify).toBe(true);
    });
  });

  describe('Performance and Load', () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle multiple sequential requests', async () => {
      const sms = new SMS('test_key');
      const balanceResponse: BalanceResponse = {
        success: true,
        balance: 100,
      };

      // Mock 10 successful responses
      for (let i = 0; i < 10; i++) {
        mockFetch.mockResolvedValueOnce(createMockResponse(balanceResponse));
      }

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(sms.balance());
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect((result as BalanceResponse).success).toBe(true);
      });
    });

    it('should handle rapid-fire requests', async () => {
      const sms = new SMS('test_key');
      const balanceResponse: BalanceResponse = {
        success: true,
        balance: 100,
      };

      mockFetch.mockResolvedValue(createMockResponse(balanceResponse));

      const startTime = Date.now();
      await Promise.all([sms.balance(), sms.balance(), sms.balance(), sms.balance(), sms.balance()]);
      const endTime = Date.now();

      // Should complete reasonably fast
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });
});
