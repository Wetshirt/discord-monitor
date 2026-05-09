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

  // Temporary response for verification
  await interaction.reply({ content: 'interaction received', ephemeral: true });
};
