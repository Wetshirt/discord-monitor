require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const voiceStateUpdateHandler = require('./events/voiceStateUpdate');
const messageCreateHandler = require('./events/messageCreate');
const messageReactionAddHandler = require('./events/messageReactionAdd');
const messageDeleteHandler = require('./events/messageDelete');
const interactionCreateHandler = require('./events/interactionCreate');
const guildMemberUpdateHandler = require('./events/guildMemberUpdate');
const { getConfig } = require('./lib/google-sheet/googleSheet.js');

const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    // GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Load initial config from Google Sheets
  try {
    const config = await getConfig();
    client.config = config;
    console.log('[Config] Initial configuration loaded from Google Sheets:', config);
  } catch (error) {
    console.error('[Config] Failed to load initial configuration:', error);
    client.config = {};
  }
});

// Triggered whenever a user’s voice state changes in any guild channel.
// This includes joining, leaving, or moving between voice channels.
client.on('voiceStateUpdate', voiceStateUpdateHandler);

// Triggered whenever a new message is created and sent in a text channel
// (including DMs, if the bot has access).
client.on('messageCreate', messageCreateHandler);

// Triggered whenever a reaction is added to a message that the bot can access.
// Handles both cached and partially cached messages.
client.on('messageReactionAdd', messageReactionAddHandler);

// Triggered whenever a message is deleted in any channel the bot can access.
// Used to detect and store deleted images from previously cached messages.
client.on('messageDelete', messageDeleteHandler);

// Triggered whenever an interaction is created (slash commands, buttons, etc.)
client.on('interactionCreate', interactionCreateHandler);

// Triggered whenever a guild member is updated (nickname changes, role changes, etc.)
client.on('guildMemberUpdate', guildMemberUpdateHandler);

client.login(TOKEN);
