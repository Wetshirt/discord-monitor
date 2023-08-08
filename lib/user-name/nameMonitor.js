require('dotenv').config();
const axios = require('axios');

const token = process.env.USER_TOKEN;
const channelId = process.env.CHANNEL_ID;
const nickName = process.env.NICKNAME;

/**
 * If user name been changed will change back
 */
async function changeNickName() {
  const data = JSON.stringify({'nick': nickName});
  const config = {
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': token,
    },
  };

  await axios.patch(`https://discord.com/api/v9/guilds/${channelId}/members/@me`, data, config);
}

module.exports = changeNickName;
