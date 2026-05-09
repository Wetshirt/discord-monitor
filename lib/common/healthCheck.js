const { initDoc } = require('../google-sheet/googleSheet');

/**
 * Validate that all required environment variables are present
 */
function validateEnv() {
  const required = [
    'DISCORD_TOKEN',
    'CLIENT_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SHEET_ID',
    'USER_ID'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Basic format validation
  if (!process.env.GOOGLE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
    throw new Error('GOOGLE_PRIVATE_KEY format seems invalid (missing BEGIN PRIVATE KEY header)');
  }
}

/**
 * Perform a safe read-only check to Google Sheets
 */
async function checkGoogleSheets() {
  try {
    console.log('[HealthCheck] Testing Google Sheets connectivity (Read-only)...');
    const doc = await initDoc();
    await doc.loadInfo(); // This is the read-only check
    console.log(`[HealthCheck] Connected to Sheet: "${doc.title}"`);
  } catch (error) {
    throw new Error(`Google Sheets connection failed: ${error.message}`);
  }
}

/**
 * Run all health checks
 */
async function runHealthCheck() {
  console.log('--- Starting Startup Health Check ---');
  
  try {
    validateEnv();
    console.log('[HealthCheck] Environment variables: OK');
    
    await checkGoogleSheets();
    console.log('[HealthCheck] Google Sheets connectivity: OK');
    
    console.log('--- Health Check Passed Successfully ---\n');
  } catch (error) {
    console.error('\n❌ --- HEALTH CHECK FAILED --- ❌');
    console.error(error.message);
    console.error('--------------------------------------\n');
    process.exit(1);
  }
}

module.exports = { runHealthCheck };
