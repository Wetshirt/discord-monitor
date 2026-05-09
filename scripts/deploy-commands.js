require('dotenv').config();
const { REST, Routes } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error('Missing env: DISCORD_TOKEN or CLIENT_ID');
  process.exit(1);
}

(async () => {
  // Minimal command list for verification
  const commands = [
    { name: 'test', description: 'Minimal test command' },
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    // Deploy commands globally (may take time to fully propagate)
    console.log(`Deploying ${commands.length} global command(s)...`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Command deployment done.');
  } catch (error) {
    console.error('Command deployment failed:', error);
    process.exit(1);
  }
})();
