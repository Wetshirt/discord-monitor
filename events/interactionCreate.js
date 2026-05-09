const { updateConfig } = require('../lib/google-sheet/googleSheet.js');
const changeNickName = require('../lib/user-name/nameMonitor');

module.exports = async (interaction) => {
  // Only handle slash commands for now
  if (!interaction.isChatInputCommand()) return;

  // Log to verify the interaction is received
  console.log('[interactionCreate]', {
    commandName: interaction.commandName,
    user: interaction.user?.tag,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
  });

  // Handle /nick command
  if (interaction.commandName === 'nick') {
    const newName = interaction.options.getString('name');
    
    // Check if the user is authorized (optional, but recommended)
    if (interaction.user.id !== process.env.USER_ID) {
      return await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      // 1. Update Google Sheets
      await updateConfig('NICKNAME', newName);
      
      // 2. Update local cache
      interaction.client.config.NICKNAME = newName;
      
      // 3. Trigger immediate nickname change
      await changeNickName(interaction.guildId, newName);

      await interaction.editReply({ content: `Successfully updated nickname to: **${newName}**` });
    } catch (error) {
      console.error('[Command: nick] Error:', error);
      await interaction.editReply({ content: 'Failed to update nickname. Check logs for details.' });
    }
    return;
  }

  // Temporary response for verification
  await interaction.reply({ content: 'interaction received', ephemeral: true });
};
