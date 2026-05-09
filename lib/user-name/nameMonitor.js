require('dotenv').config();
const axios = require('axios');

const token = process.env.USER_TOKEN;

/**
 * If user name been changed will change back
 * @param {string} guildId
 * @param {string} nickname
 */
async function changeNickName(guildId, nickname) {
  const data = JSON.stringify({ 'nick': nickname });
  const config = {
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': token,
    },
  };

  await axios.patch(`https://discord.com/api/v9/guilds/${guildId}/members/@me`, data, config);
}

module.exports = changeNickName;
