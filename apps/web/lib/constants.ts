import { EXP_PER_LEVEL } from '@calc-exp-hyrz-v2/core';

export const RECOVERYPER = 6;

export interface LevelData {
  level: number;
  expRequired: number;
  totalExp: number;
}

export function getLevelTableData(): LevelData[] {
  const data: LevelData[] = [];

  for (let level = 1; level <= 165; level++) {
    const totalExp = EXP_PER_LEVEL[level as keyof typeof EXP_PER_LEVEL];
    const prevTotalExp = level > 1 ? EXP_PER_LEVEL[level - 1 as keyof typeof EXP_PER_LEVEL] : 0;
    const expRequired = totalExp - prevTotalExp;

    data.push({
      level,
      expRequired,
      totalExp
    });
  }

  return data;
}