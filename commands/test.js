module.exports = {
  name: 'test',
  description: 'Minimal test command',
  async execute(interaction) {
    await interaction.reply({ content: 'Test command received and executed!', ephemeral: true });
  },
};
