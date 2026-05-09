const { updateRow, createLoggingInfo } = require('../lib/google-sheet/googleSheet.js');
const { getCurrentTime } = require('../lib/common/date.js');

/**
 * Get a user's display name:
 * - Prefer guild nickname
 * - Fallback to global username
 * - Fallback to "Unknown" if missing
 */
function getDisplayName(member) {
  if (!member) return 'Unknown';
  return member.nickname || member.user?.username || 'Unknown';
}

module.exports = async (oldState, newState) => {
  const now = getCurrentTime();
  const client = newState.client || oldState.client;
  const voiceManager = client.voiceManager;

  // User joined a voice channel
  if (newState.channelId && !oldState.channelId) {
    const member = newState.member;
    const name = getDisplayName(member);

    console.log(`[${now}] 🔊 Join: ${name}`);
    
    // Record join time
    if (voiceManager) {
      voiceManager.onJoin(member.id, now);
    }

    await updateRow(member.id, name, now);
    await createLoggingInfo(member.id, name, now, 'enter channel');
    return;
  }

  // User left a voice channel
  if (oldState.channelId && !newState.channelId) {
    const member = oldState.member;
    const name = getDisplayName(member);

    console.log(`[${now}] 🔇 Leave: ${name}`);

    // Calculate duration
    let duration = 'N/A';
    if (voiceManager) {
      duration = voiceManager.onLeave(member.id, now) || 'N/A';
      console.log(`[${now}] 🕒 Duration for ${name}: ${duration}`);
    }

    await updateRow(member.id, name, now);
    await createLoggingInfo(member.id, name, now, `leave channel (Duration: ${duration})`);
    return;
  }

  // User switched channels or made another state change
  console.log(`[${now}] ⏩ Voice state changed, not join/leave.`);
};
