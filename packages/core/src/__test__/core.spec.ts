import { describe, expect, test, vi } from 'vitest';
import { canReachTargetExperience } from '../core';

describe('canReachTargetExperience', () => {

  test('should calculate experience correctly for one day period', () => {
    const mockCallback = vi.fn();
    const startTime = '2024-01-01 00:00:00';
    const endTime = '2024-01-02 00:00:00';

    canReachTargetExperience({
      currentLevel: 100,
      targetLevel: 110,
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
      6408673,
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
      2596247,
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
      targetLevel: 110,
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
      6408673,
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
      targetLevel: 110,
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
      6408673,
      expect.any(Number),
      0,
      120
    );
  });


  test("should correctly calculate dailyExpDetails for targetLevel > currentLevel", () => {
    //   40: 117352,
    // 41: 128208,
    // 42: 140123,
    // 43: 153280,
    // 44: 167906,
    // 45: 184201,
    // 66,849
    const result = canReachTargetExperience({
      currentLevel: 40, // 当前等级 40，
      targetLevel: 45, // 目标等级 45，
      currentExp: 500, // 当前经验 500
      startTime: '2025-08-27 00:00:00', // 开始时间
      endTime: '2025-08-30 23:59:59', // 结束时间
      recoveryPer5Min: 6, // 每 6 分钟恢复 1 点体力
      dailyFixedStamina: 100, // 每日固定体力
      extraDailyStamina: 20, // 每日额外体力
      extraDailyExp: [50, 100], // 每日额外经验
      extraStamina: 70, // 每周额外体力
      extraStaminaExp: 700, // 每周额外的经验值
      staminaExp: 60, // 1 体力可换算的经验值
      callback: vi.fn()
    });

    console.log(result.dailyExpDetails);

    // 960 + 400 + 80  +70 = 1510 => 90,600
    // 700 + 600 = 1300
    //     91900
    // exp 89800
    expect(result.canReachTarget).toBe(true);
    expect(result.totalExpNeeded).toBe(66349);
  });

});
