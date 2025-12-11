import Api from '@/api';

describe('End-to-end connection test', () => {
  it('should receive { status: "API is running!" } from the root endpoint', async () => {
    if (!Api.getUri) {
      fail('API_BASE_URL is not defined for the current environment.');
      return;
    }

    try {
      // Assuming the API endpoint for status is at the root of urlBase
      const response = await Api.get(`/`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'API is running!' });
    } catch (error) {
      console.error('API connection failed:', error.message);
      fail(`Failed to connect to the API or received an unexpected response: ${error.message}`);
    }
  });
});