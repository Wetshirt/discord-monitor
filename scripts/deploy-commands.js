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
    { name: 'ping', description: 'Check if the bot is alive' },
    { 
      name: 'mnick', 
      description: 'Set your persistent nickname (Monitor Bot)',
      options: [
        {
          name: 'name',
          description: 'The new nickname',
          type: 3, // STRING
          required: true,
        },
      ],
    },
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const GUILD_ID = process.env.GUILD_ID;

  try {
    if (GUILD_ID) {
      console.log(`Deploying ${commands.length} guild command(s) to guild ${GUILD_ID}...`);
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log('Guild command deployment done.');
    } else {
      console.log(`Deploying ${commands.length} global command(s)...`);
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log('Global command deployment done (may take an hour to propagate).');
    }
  } catch (error) {
    console.error('Command deployment failed:', error);
    process.exit(1);
  }
})();
