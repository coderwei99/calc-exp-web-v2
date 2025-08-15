export interface CalculationParams {
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
}

export interface CalculationResult {
  isReachable: boolean;
  remainingExp: number;
  requiredStamina: number;
  dailyExtraStaminaNeeded?: number;
}

export type DailyExpDetail = {
  date: string;
  exp: number;
  difference: number;
  currentLevel: number;
  dailyExp: number;
}[];