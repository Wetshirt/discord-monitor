/**
 *  execute after exit index.js
 */

require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: []
});

const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN);
client.destroy();

console.log('logout');
process.exit(0);
