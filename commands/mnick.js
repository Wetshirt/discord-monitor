const { updateConfig } = require('../lib/google-sheet/googleSheet.js');
const changeNickName = require('../lib/user-name/nameMonitor');

module.exports = {
  name: 'mnick',
  description: 'Set your persistent nickname (Monitor Bot)',
  async execute(interaction) {
    const newName = interaction.options.getString('name');
    const userId = interaction.user.id;
    const configuredUserId = process.env.USER_ID;

    // Authorization check
    if (userId.trim() !== configuredUserId.trim()) {
      return await interaction.reply({ 
        content: 'You are not authorized to use this command.', 
        ephemeral: true 
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      // 1. Set pending flag to avoid race condition with guildMemberUpdate
      interaction.client.pendingNickChange = newName;

      // 2. Update Google Sheets
      await updateConfig('NICKNAME', newName);
      
      // 3. Update local cache
      interaction.client.config.NICKNAME = newName;
      
      // 4. Change nickname via Discord API
      await changeNickName(interaction.guildId, newName);

      await interaction.editReply({ 
        content: `✅ Nickname successfully updated to: **${newName}**` 
      });
      console.log(`[Command: mnick] User ${interaction.user.tag} updated nickname to ${newName}`);
    } catch (error) {
      interaction.client.pendingNickChange = null;
      console.error('[Command: mnick] Error:', error.message);
      await interaction.editReply({ 
        content: `❌ Failed to update nickname: ${error.message}` 
      });
    }
  },
};
