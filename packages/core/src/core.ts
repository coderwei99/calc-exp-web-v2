import { calcExpDiff } from './calcExpDiff';
import { logger } from './logger';
import { keepDecimals } from './utils';
import { EXP_PER_LEVEL } from './exp';
import { DailyExpDetail } from './types';

export function canReachTargetExperience(
  {
    // 当前等级
    currentLevel,
    // 目标等级
    targetLevel,
    // 已有经验
    currentExp,
    // 开始时间
    startTime,
    // 结束时间
    endTime,
    // 每多少分钟恢复1点体力
    recoveryPer5Min,
    // 每天固定获得的体力
    dailyFixedStamina,
    // 每天额外的体力
    extraDailyStamina = 0,
    // 每天额外获得的经验
    extraDailyExp = [0, 0],
    // 每周额外获得的体力
    extraStamina = 0,
    // 1体力可换算的经验值
    staminaExp = 120,
    // 每周额外获得的经验值
    extraStaminaExp = 0,
    callback = (startTime: string, endTime: string, expDiff: number, totalExperience: number, days: number, staminaExp: number) => {
      console.log('startTime: ', startTime);
      console.log('endTime: ', endTime);
      console.log('expDiff: ', expDiff);
      console.log('totalExperience: ', totalExperience);
      console.log('days: ', days);
      console.log('staminaExp: ', staminaExp);
    }
  }: {
    currentLevel: number;
    targetLevel: number;
    currentExp: number;
    startTime: string;
    endTime: string;
    recoveryPer5Min: number;
    dailyFixedStamina: number;
    extraDailyStamina: number;
    extraDailyExp: number[];
    extraStamina: number;
    staminaExp: number;
    extraStaminaExp: number;
    callback: (startTime: string, endTime: string, expDiff: number, totalExperience: number, days: number, staminaExp: number) => void;
  }): {
    canReachTarget: boolean;
    totalExpNeeded: number;
    dailyExpGain: number;
    shortfall: number;
    staminaEquivalent: number;
    dailyExpDetails: DailyExpDetail;
  } {
  // 计算所需经验差
  const expDiff = calcExpDiff(currentLevel, currentExp, targetLevel);
  console.log('expDiff: ', expDiff);

  // 计算时间跨度（分钟）
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const timeDiffMinutes = (end - start) / (1000 * 60);

  // 每5分钟恢复的次数
  const recoveryTimes = timeDiffMinutes / recoveryPer5Min;
  const recoveredStamina = recoveryTimes * 1;
  console.log('自然恢复体力: ', recoveredStamina);

  // 计算天数
  const days = Math.ceil(timeDiffMinutes / (24 * 60));
  console.log('天数: ', days);

  // 计算每日体力
  const totalDailyStamina = days * (dailyFixedStamina + extraDailyStamina);

  // 计算每周额外体力与经验
  const weeks = Math.ceil(days / 7);
  const dailyExtraStamina = extraStamina / 7; // 每周体力均摊到每天
  const dailyExtraStaminaExp = extraStaminaExp / 7; // 每周经验均摊到每天
  const totalExtraStamina = dailyExtraStamina * days;
  const totalExtraStaminaExp = dailyExtraStaminaExp * days;

  // 每日额外经验
  const totalExtraDailyExp = days * extraDailyExp.reduce((sum, exp) => sum + exp, 0);

  // 总体力转换为经验值
  const totalStaminaExperience = (recoveredStamina + totalDailyStamina + totalExtraStamina) * staminaExp;
  // 总经验值
  const totalExperience = totalStaminaExperience + totalExtraDailyExp + totalExtraStaminaExp;
  console.log('总体力: ', recoveredStamina + totalDailyStamina + totalExtraStamina);
  console.log('总经验值: ', totalExperience);

  // 生成每日经验详情
  const dailyExpDetails: DailyExpDetail = [];
  let currentLevelTracker = currentLevel;
  let currentExpAccumulated = currentExp;
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start + i * 24 * 60 * 60 * 1000);
    console.log(currentDate, 'currentDate');
    const dateStr = currentDate.toISOString().split('T')[0];

    // 每日体力：固定、额外和自然恢复
    const dailyStamina = dailyFixedStamina + extraDailyStamina + (recoveredStamina / days) + dailyExtraStamina;
    const dailyStaminaExp = dailyStamina * staminaExp;

    // 每日经验：体力经验 + 每日额外经验 + 每周额外经验
    const dailyExp = dailyStaminaExp + extraDailyExp.reduce((sum, exp) => sum + exp, 0) + dailyExtraStaminaExp;

    // 累加经验
    currentExpAccumulated += dailyExp;

    // 处理升级
    while (
      currentLevelTracker < 165 &&
      EXP_PER_LEVEL[currentLevelTracker + 1] &&
      currentExpAccumulated >= EXP_PER_LEVEL[currentLevelTracker + 1] - EXP_PER_LEVEL[currentLevelTracker]
    ) {
      currentExpAccumulated -= EXP_PER_LEVEL[currentLevelTracker + 1] - EXP_PER_LEVEL[currentLevelTracker];
      currentLevelTracker++;
    }

    // 计算 difference：目标等级经验 - 当前等级基线经验 - 当前经验
    const difference = targetLevel && targetLevel > currentLevelTracker
      ? Math.max(0, EXP_PER_LEVEL[targetLevel] - EXP_PER_LEVEL[currentLevelTracker] - currentExpAccumulated)
      : 0;

    dailyExpDetails.push({
      date: dateStr,
      exp: keepDecimals(currentExpAccumulated, 0), // 当前经验
      difference: keepDecimals(difference, 0), // 还差多少经验到目标
      currentLevel: currentLevelTracker, // 当前等级
      dailyExp: keepDecimals(dailyExp, 0) // 日均经验
    });
  }

  // 执行回调函数
  callback(startTime, endTime, expDiff, totalExperience, days, staminaExp);

  return {
    // 是否可以达成
    canReachTarget: totalExperience >= expDiff,
    // 所需总经验
    totalExpNeeded: expDiff,
    // 日均经验
    dailyExpGain: keepDecimals(totalExperience / days),
    // 经验缺口
    shortfall: keepDecimals(expDiff - totalExperience),
    // 折合体力
    staminaEquivalent: keepDecimals((expDiff - totalExperience) / staminaExp, 0),
    dailyExpDetails
  };
}