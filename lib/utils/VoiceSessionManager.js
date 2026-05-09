const { calculateDuration } = require('./timeUtils');

class VoiceSessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Record when a user joins
   * @param {string} userId 
   * @param {string} joinTime 
   */
  onJoin(userId, joinTime) {
    this.sessions.set(userId, joinTime);
  }

  /**
   * Calculate duration when a user leaves
   * @param {string} userId 
   * @param {string} leaveTime 
   * @returns {string|null} Duration string or null if no join record
   */
  onLeave(userId, leaveTime) {
    const joinTime = this.sessions.get(userId);
    if (!joinTime) return null;

    const duration = calculateDuration(joinTime, leaveTime);
    this.sessions.delete(userId);
    return duration;
  }
}

module.exports = VoiceSessionManager;
