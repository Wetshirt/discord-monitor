const { createLoggingInfo } = require('../lib/google-sheet/googleSheet.js');
const { getCurrentTime } = require('../lib/common/date.js');

module.exports = (message) => {
  if (message.author.bot) return;

  console.log('new message...');
  console.log(message.author.id);
  console.log(message.author.username);

  createLoggingInfo(message.author.id, message.author.username, getCurrentTime(), 'message');
};
