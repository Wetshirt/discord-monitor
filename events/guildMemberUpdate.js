const changeNickName = require('../lib/user-name/nameMonitor');

module.exports = async (oldMember, newMember) => {
  // We only care if the nickname changed
  if (oldMember.nickname === newMember.nickname) return;

  const nickName = newMember.client.config?.NICKNAME || process.env.NICKNAME;
  
  // If the new nickname is already what we want, do nothing
  if (newMember.nickname === nickName) return;

  // We need to identify if this is the user we are monitoring.
  // For now, let's assume we monitor the user whose ID matches a specific env var,
  // or if USER_TOKEN belongs to the bot itself, we check newMember.id === newMember.client.user.id
  
  // Since nameMonitor.js uses @me with USER_TOKEN, it's likely a specific user account.
  // We'll check if the member ID matches the one we want to protect.
  const monitoredId = process.env.USER_ID;

  if (newMember.id === monitoredId) {
    console.log('[Nickname Monitor] Detected nickname change for ' + newMember.user.tag + ': ' + oldMember.nickname + ' -> ' + newMember.nickname);
    try {
      await changeNickName(newMember.guild.id, nickName);
      console.log('[Nickname Monitor] Successfully changed nickname back to ', nickName);
    } catch (error) {
      console.error('[Nickname Monitor] Failed to change nickname:', error.response?.data || error.message);
    }
  }
};
