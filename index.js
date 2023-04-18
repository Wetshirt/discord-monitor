require('dotenv').config();
const {updateRow} = require('./googleSheet.js');
const {createLoggingInfo} = require('./googleSheet.js');
const {getCurrentTime} = require('./date.js');

// keep our service alive
require('./keep_alive.js');
const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
  intents: [
    // GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
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
    console.log(newPresence.member.id);
    console.log(newPresence.clientStatus);
    const user = client.users.cache.get(newPresence.member.id);
    console.log(user.username);
    createLoggingInfo(newPresence.member.id, user.username, getCurrentTime(),
        JSON.stringify(newPresence.clientStatus));
  }
});

const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN);
// client.destroy();
