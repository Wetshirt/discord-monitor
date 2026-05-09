const { getConfig, updateConfig } = require('../lib/google-sheet/googleSheet.js');

// Mock google-spreadsheet
jest.mock('google-spreadsheet', () => {
  const mockRows = [
    { get: jest.fn((key) => (key === 'Key' ? 'NICKNAME' : '舊名字')), set: jest.fn(), save: jest.fn() }
  ];
  const mockSheet = {
    getRows: jest.fn(async () => mockRows),
    addRow: jest.fn(async (data) => mockRows.push({ get: jest.fn((k) => data[k]), set: jest.fn(), save: jest.fn() })),
    title: 'Config'
  };
  const mockDoc = {
    loadInfo: jest.fn(),
    sheetsByTitle: { 'Config': mockSheet },
    sheetsByIndex: [{}, mockSheet]
  };
  return {
    GoogleSpreadsheet: jest.fn(() => mockDoc)
  };
});

describe('Google Sheets Config Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should load config correctly', async () => {
    const config = await getConfig();
    expect(config.NICKNAME).toBe('舊名字');
  });

  test('should update existing config key', async () => {
    await updateConfig('NICKNAME', 'new-nick');
    // We need to check if the mock row was updated
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const doc = new GoogleSpreadsheet();
    const sheet = doc.sheetsByTitle['Config'];
    const rows = await sheet.getRows();
    const nickRow = rows.find(r => r.get('Key') === 'NICKNAME');
    
    expect(nickRow.set).toHaveBeenCalledWith('Value', 'new-nick');
    expect(nickRow.save).toHaveBeenCalled();
  });
});
