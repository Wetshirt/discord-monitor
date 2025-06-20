require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const voiceStateUpdateHandler = require('./events/voiceStateUpdate');
const messageCreateHandler = require('./events/messageCreate');
const messageReactionAddHandler = require('./events/messageReactionAdd');
const messageDeleteHandler = require('./events/messageDelete');

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

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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

client.login(TOKEN);
