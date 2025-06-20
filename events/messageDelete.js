const { createLoggingInfo } = require('../lib/google-sheet/googleSheet.js');
const { getCurrentTime } = require('../lib/common/date.js');

module.exports = async function messageDeleteHandler(message) {
  console.log('Message deleted:');

  // If the message is partial (not fully cached), try to fetch full data
  if (message.partial) {
    try {
      message = await message.fetch();
    } catch (err) {
      console.error('Failed to fetch partial message:', err);
      return;
    }
  }

  const userId = message.author?.id || 'Unknown';
  const username = message.author?.username || 'Unknown';
  const timestamp = getCurrentTime();

  // Log message deletion event
  createLoggingInfo(userId, username, timestamp, 'Message deleted');

   // Loop through all attachments in the message
  for (const attachment of message.attachments.values()) {
    if (attachment.contentType?.startsWith('image')) {
       createLoggingInfo(userId, username, timestamp, `deleted image: ${attachment.url}`);

      // Log to the same channel where the message was deleted
      const replyContent = `An Image by <@${userId}> was deleted. Check this out: ${attachment.url}`;
      try {
        await message.channel.send(replyContent);
      } catch (error) {
        console.error('Failed to send message in delete channel:', error);
      }
    }
  }
};
