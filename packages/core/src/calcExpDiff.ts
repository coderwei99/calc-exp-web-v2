import { EXP_PER_LEVEL } from './exp';

// 计算经验差
export function calcExpDiff(currentLevel: number, currentExp: number, targetLevel: number = 110) {
  return EXP_PER_LEVEL[targetLevel] - EXP_PER_LEVEL[currentLevel] - currentExp;
}