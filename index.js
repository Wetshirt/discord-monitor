require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const voiceStateUpdateHandler = require('./events/voiceStateUpdate');
const messageCreateHandler = require('./events/messageCreate');
const messageReactionAddHandler = require('./events/messageReactionAdd');
const messageDeleteHandler = require('./events/messageDelete');
const interactionCreateHandler = require('./events/interactionCreate');
const guildMemberUpdateHandler = require('./events/guildMemberUpdate');
const { getConfig } = require('./lib/google-sheet/googleSheet.js');
const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const VoiceSessionManager = require('./lib/utils/VoiceSessionManager');
const { runHealthCheck } = require('./lib/common/healthCheck');

// Run startup health checks
(async () => {
  await runHealthCheck();
})();

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

// Initialize config early to avoid reference issues
client.config = {};
client.pendingNickChange = null;
client.commands = new Collection();
client.voiceManager = new VoiceSessionManager();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('name' in command && 'execute' in command) {
    client.commands.set(command.name, command);
  }
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Load initial config from Google Sheets
  try {
    const config = await getConfig();
    Object.assign(client.config, config);
    console.log('[Config] Initial configuration loaded from Google Sheets:', client.config);
  } catch (error) {
    console.error('[Config] Failed to load initial configuration:', error);
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
client.on('interactionCreate', (interaction) => {
  console.log(`[Index] Received interaction: ${interaction.commandName || 'Unknown'} from ${interaction.user.tag}`);
  interactionCreateHandler(interaction);
});

// Triggered whenever a guild member is updated (nickname changes, role changes, etc.)
client.on('guildMemberUpdate', guildMemberUpdateHandler);

client.login(TOKEN);
