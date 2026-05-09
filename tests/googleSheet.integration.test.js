const { getConfig, updateConfig } = require('../lib/google-sheet/googleSheet.js');

// Only run if a valid test sheet ID is provided
const isTestSheetConfigured = process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SHEET_ID !== 'YOUR_TEST_SHEET_ID_HERE';

(isTestSheetConfigured ? describe : describe.skip)('Google Sheets Integration Tests', () => {
  const testKey = 'TEST_INTEGRATION_KEY';
  const testValue = `test-value-${Date.now()}`;

  test('should write and then read a config value from a real sheet', async () => {
    // 1. Update config
    await updateConfig(testKey, testValue);

    // 2. Read config
    const config = await getConfig();
    
    // 3. Verify
    expect(config[testKey]).toBe(testValue);
  }, 15000); // Higher timeout for real API calls

  test('should handle adding new keys correctly', async () => {
    const uniqueKey = `NEW_KEY_${Date.now()}`;
    await updateConfig(uniqueKey, 'new-value');
    
    const config = await getConfig();
    expect(config[uniqueKey]).toBe('new-value');
  }, 15000);
});

if (!isTestSheetConfigured) {
  console.warn('⚠️  Skipping Google Sheets Integration Tests: GOOGLE_SHEET_ID in .env.test is not configured.');
}
