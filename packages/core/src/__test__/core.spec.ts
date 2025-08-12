import { beforeEach, describe, expect, test, vi } from 'vitest';
import { canReachTargetExperience } from '../core';
import { calcExpDiff } from '../calcExpDiff';

vi.mock('../calcExpDiff', () => ({
  calcExpDiff: vi.fn()
}));

describe('canReachTargetExperience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock calcExpDiff to return fixed value
    (calcExpDiff as ReturnType<typeof vi.fn>).mockReturnValue(1000);
  });

  test('should calculate experience correctly for one day period', () => {
    const mockCallback = vi.fn();
    const startTime = '2024-01-01 00:00:00';
    const endTime = '2024-01-02 00:00:00';

    canReachTargetExperience({
      currentLevel: 100,
      currentExp: 0,
      startTime,
      endTime,
      recoveryPer5Min: 6,
      dailyFixedStamina: 100,
      extraDailyStamina: 50,
      extraDailyExp: [1000, 2000],
      extraStamina: 20,
      staminaExp: 120,
      extraStaminaExp: 500,
      callback: mockCallback
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      startTime,
      endTime,
      1000, // expDiff from mock
      expect.any(Number), // totalExperience
      1, // days
      120 // staminaExp
    );
  });

  test('should calculate multi-day period correctly', () => {
    const mockCallback = vi.fn();
    const startTime = '2024-01-01 00:00:00';
    const endTime = '2024-01-07 00:00:00';

    canReachTargetExperience({
      currentLevel: 100,
      targetLevel: 105,
      currentExp: 1000,
      startTime,
      endTime,
      recoveryPer5Min: 6,
      dailyFixedStamina: 200,
      extraDailyStamina: 100,
      extraDailyExp: [2000, 3000],
      extraStamina: 500,
      staminaExp: 150,
      extraStaminaExp: 1000,
      callback: mockCallback
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      startTime,
      endTime,
      1000,
      expect.any(Number),
      6,
      150
    );
  });

  test('should handle default values correctly', () => {
    const mockCallback = vi.fn();
    const startTime = '2024-01-01 00:00:00';
    const endTime = '2024-01-02 00:00:00';
    canReachTargetExperience({
      currentLevel: 100,
      currentExp: 0,
      startTime,
      endTime,
      recoveryPer5Min: 6,
      dailyFixedStamina: 100,
      extraDailyStamina: 50,
      extraDailyExp: [0, 0],  // 添加默认值
      extraStamina: 0,        // 添加默认值
      staminaExp: 120,        // 添加默认值
      extraStaminaExp: 0,     // 添加默认值
      callback: mockCallback
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      startTime,
      endTime,
      1000,
      expect.any(Number),
      1,
      120
    );
  });

  test('should handle zero duration correctly', () => {
    const mockCallback = vi.fn();
    const time = '2024-01-01 00:00:00';

    canReachTargetExperience({
      currentLevel: 100,
      currentExp: 0,
      startTime: time,
      endTime: time,
      recoveryPer5Min: 6,
      dailyFixedStamina: 100,
      extraDailyStamina: 0,
      extraDailyExp: [0, 0],
      extraStamina: 0,
      staminaExp: 120,
      extraStaminaExp: 0,
      callback: mockCallback
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      time,
      time,
      1000,
      expect.any(Number),
      0,
      120
    );
  });
});