const mnickCommand = require('../commands/mnick');
const { updateConfig } = require('../lib/google-sheet/googleSheet.js');
const changeNickName = require('../lib/user-name/nameMonitor');

jest.mock('../lib/google-sheet/googleSheet.js');
jest.mock('../lib/user-name/nameMonitor');

describe('mnick Command', () => {
  let interaction;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock interaction object
    interaction = {
      user: { id: '405282298360233995', tag: 'testuser#0001' },
      options: { getString: jest.fn().mockReturnValue('new-nickname') },
      guildId: 'guild123',
      reply: jest.fn(),
      deferReply: jest.fn(),
      editReply: jest.fn(),
      client: {
        config: { NICKNAME: 'old-nickname' },
        pendingNickChange: null
      }
    };
    
    process.env.USER_ID = '405282298360233995';
  });

  test('should deny unauthorized users', async () => {
    interaction.user.id = 'wrong-user-id';
    
    await mnickCommand.execute(interaction);
    
    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: 'You are not authorized to use this command.',
      ephemeral: true
    }));
  });

  test('should update nickname for authorized users', async () => {
    updateConfig.mockResolvedValue();
    changeNickName.mockResolvedValue();

    await mnickCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(updateConfig).toHaveBeenCalledWith('NICKNAME', 'new-nickname');
    expect(interaction.client.config.NICKNAME).toBe('new-nickname');
    expect(interaction.client.pendingNickChange).toBe('new-nickname');
    expect(changeNickName).toHaveBeenCalledWith('guild123', 'new-nickname');
    expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('successfully updated')
    }));
  });

  test('should clear pending flag on error', async () => {
    updateConfig.mockRejectedValue(new Error('Sheet Error'));

    await mnickCommand.execute(interaction);

    expect(interaction.client.pendingNickChange).toBeNull();
    expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('Failed to update')
    }));
  });
});
