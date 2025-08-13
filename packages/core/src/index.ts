export { canReachTargetExperience } from "./core";
export { logger } from "./logger";
export { EXP_PER_LEVEL } from "./exp";

import { canReachTargetExperience } from './core';
import { logger } from "./logger";

export function test(w: string) {
  console.log('tesqqsdasdsssdt', w);
}
test('[qwddeweqweqwewq ]');


// // 正常情况: 预留容错
// const startTime = '2025-01-4 12:00:00'
// const endTime = '2025-01-4 12:00:00' 
// const recoveryPer5Min = 6  // 每多少分钟可以恢复1点体力
// const dailyFixedStamina = 600 // 每天固定买的体力 12体
// const extraDailyStamina = 550 // 每天额外的体力 300 拉面 + 150 月卡 + 50 一轮铜币 + 50 好友
// const extraDailyExp = [75000, 60000] // 每天额外获得的丰饶和宝箱经验值
// const extraStamina = ((30 + 50 + 80 + 80 + 150) * 7) + 300 // 体力特惠 + 300月卡(存货)
// const extraStaminaExp = 60000 // 祈愿所得经验值
// const staminaExp = 120 // 1体力可换算的经验值 106级的标准


"2025-08-30T16:00:00.000Z";

const startTime = '2025-08-01 10:00:00'; // 2025年7月3日10点
const endTime = '2025-09-21 11:00:00'; // 2025年9月1日11点
const recoveryPer5Min = 6;  // 每多少分钟可以恢复1点体力
const dailyFixedStamina = 150; // 每天固定买的体力
const extraDailyStamina = 400; // 每天额外的体力 300 拉面  50 一轮铜币  50 好友
const extraDailyExp = [108000, 80000]; // 每天额外获得的丰饶和宝箱经验值
const extraStamina = 100; // 体力特惠  + 100v7周礼包
const extraStaminaExp = 0; // 祈愿所得经验值
const staminaExp = 154; // 1体力可换算的经验值 106级的标准

// 1040 * 7 = 7280

const ret = canReachTargetExperience({
  currentLevel: 138,
  currentExp: 1630000,
  targetLevel: 140,
  startTime,
  endTime,
  recoveryPer5Min,
  dailyFixedStamina,
  extraDailyStamina,
  extraDailyExp,
  extraStamina,
  staminaExp,
  extraStaminaExp,
  callback: logger
});
console.log('ret1', ret);

// 600 + 300 + 150 + 50 + 240 + 390 = 1730


// 690208 + 754769+ 827600 + 905061 - 222163

// 2,955,475