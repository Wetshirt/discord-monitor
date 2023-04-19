require('dotenv').config();
const {updateRow} = require('./googleSheet.js');
const {createLoggingInfo} = require('./googleSheet.js');
const {getCurrentTime} = require('./date.js');

// keep our service alive
require('./keep_alive.js');
const {Client, GatewayIntentBits, Partials} = require('discord.js');

const client = new Client({
  intents: [
    // GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// channel id: 809263485056712705
// channel name: 比起說我好像更喜歡聽
// when a channel happened some events  will trigger this function
client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.channelId && !oldState.channelId) {
    console.log('Someone joined');
    console.log(newState.member.nickname);

    // write connect time to user
    updateRow(newState.member.id, newState.member.nickname, getCurrentTime());
    createLoggingInfo(newState.member.id, newState.member.nickname,
        getCurrentTime(), 'enter channel');
  } else if (oldState.channelId && !newState.channelId) {
    console.log('Someone left');
    console.log(oldState.member.nickname);
  } else {
    console.log('Neither of the two actions occured');
    // ...
  }
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (newPresence && newPresence.status === 'online') {
    if (newPresence.member.bot) {
      return;
    }
    console.log(newPresence.member.id);
    console.log(newPresence.clientStatus);
    const user = client.users.cache.get(newPresence.member.id);
    console.log(user.username);
    createLoggingInfo(newPresence.member.id, user.username, getCurrentTime(),
        JSON.stringify(newPresence.clientStatus));
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return;
  }
  console.log('new message...');
  console.log(message.author.id);
  console.log(message.author.username);

  createLoggingInfo(message.author.id, message.author.username,
      getCurrentTime(), 'message');
});

// reaction occured
client.on('messageReactionAdd', async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    /**
     * If the message this reaction belongs to was removed
     * the fetching might result in an API error which should be handled
     */
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  // Now the message has been cached and is fully available
  if (user.bot === true) {
    return;
  }
  console.log('new reaction...');
  console.log(user.id);
  console.log(user.username);
  createLoggingInfo(user.id,
      user.username, getCurrentTime(), reaction.emoji.name);
});

const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN);
// client.destroy();
