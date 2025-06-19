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

  // User joined a voice channel
  if (newState.channelId && !oldState.channelId) {
    const member = newState.member;
    const name = getDisplayName(member);

    console.log(`[${now}] 🔊 Join: ${name}`);

    await updateRow(member.id, name, now);
    await createLoggingInfo(member.id, name, now, 'enter channel');
    return;
  }

  // User left a voice channel
  if (oldState.channelId && !newState.channelId) {
    const member = oldState.member;
    const name = getDisplayName(member);

    console.log(`[${now}] 🔇 Leave: ${name}`);

    await updateRow(member.id, name, now);
    await createLoggingInfo(member.id, name, now, 'leave channel');
    return;
  }

  // User switched channels or made another state change
  console.log(`[${now}] ⏩ Voice state changed, not join/leave.`);
};
