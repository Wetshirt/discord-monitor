const VoiceSessionManager = require('../lib/utils/VoiceSessionManager');

describe('VoiceSessionManager', () => {
  let manager;

  beforeEach(() => {
    manager = new VoiceSessionManager();
  });

  test('should record join time correctly', () => {
    const userId = 'user123';
    const joinTime = '2024/5/9 下午 1:00:00';
    manager.onJoin(userId, joinTime);
    expect(manager.sessions.get(userId)).toBe(joinTime);
  });

  test('should return duration and clear session on leave', () => {
    const userId = 'user123';
    const joinTime = '2024/5/9 下午 1:00:00';
    const leaveTime = '2024/5/9 下午 2:00:00';
    
    manager.onJoin(userId, joinTime);
    const duration = manager.onLeave(userId, leaveTime);
    
    expect(duration).toBe('1 小時 0 分鐘 0 秒');
    expect(manager.sessions.has(userId)).toBe(false);
  });

  test('should return null if user leaves without join record', () => {
    const duration = manager.onLeave('unknown', '2024/5/9 下午 1:00:00');
    expect(duration).toBeNull();
  });
});
