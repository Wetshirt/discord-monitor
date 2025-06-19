const { createLoggingInfo } = require('../lib/google-sheet/googleSheet.js');
const { getCurrentTime } = require('../lib/common/date.js');

module.exports = async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  if (user.bot) return;

  console.log('new reaction...');
  console.log(user.id);
  console.log(user.username);

  createLoggingInfo(user.id, user.username, getCurrentTime(), reaction.emoji.name);
};
