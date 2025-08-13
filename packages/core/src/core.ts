import { calcExpDiff } from './calcExpDiff';
import { logger } from './logger';
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
    // 每多少分钟可以恢复1点体力
    recoveryPer5Min,
    // 每天固定获得的体力
    dailyFixedStamina,
    // 每天额外的体力
    extraDailyStamina = 0,
    extraDailyExp = [0, 0],
    // 意外所得体力
    extraStamina = 0,
    // 1体力可换算的经验值
    staminaExp = 120,
    // 意外所得经验值
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
    targetLevel?: number;
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
  }) {
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

  // 计算每日体力
  const days = Math.ceil(timeDiffMinutes / (24 * 60));
  console.log('天数: ', days);

  const totalDailyStamina = days * (dailyFixedStamina + extraDailyStamina);

  // 每日额外经验值
  const totalExtraDailyExp = days * extraDailyExp.reduce((sum, exp) => sum + exp, 0);

  // 总体力转换为经验值
  const totalStaminaExperience = (recoveredStamina + totalDailyStamina + extraStamina) * staminaExp;
  // 总经验值
  const totalExperience = totalStaminaExperience + totalExtraDailyExp + extraStaminaExp;
  console.log('总体力: ', recoveredStamina + totalDailyStamina + extraStamina);
  console.log('总经验值: ', totalExperience);
  // 判断是否达到目标经验值

  callback(startTime, endTime, expDiff, totalExperience, days, staminaExp);

  // canReachTarget: Math.random() > 0.3,
  // daysNeeded: Math.floor(Math.random() * timeRange.totalDays) + 1,
  // totalExpNeeded: Math.floor(Math.random() * 50000) + 10000,
  // dailyExpGain: calculatedTotals.totalDailyExp + calculatedTotals.totalDailyExpFromStamina,
  // shortfall: Math.floor(Math.random() * 10000),
  return {
    // 是否可以达成
    canReachTarget: totalExperience >= expDiff,
    // 所需总经验
    totalExpNeeded: totalExperience,
    // 日均经验
    dailyExpGain: totalExperience / days,
    // 经验缺口
    shortfall: totalExperience >= expDiff ? 0 : totalExperience - expDiff
  };
}