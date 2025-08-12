export function logger(startTime: string, endTime: string, targetExp: number, totalExperience: number, days: number, staminaExp: number) {
  const remainingExp = targetExp - totalExperience;
  const ret1 = `${startTime} 到 ${endTime} \n可以, 溢出${remainingExp}点经验 折合${Math.ceil(remainingExp / staminaExp)}点体力`;
  const ret2 = `${startTime} 到 ${endTime} \n不可以, 还差${remainingExp}点经验 折合${Math.ceil(remainingExp / staminaExp)}点体力 \n每天需要多${Math.ceil(Math.ceil(remainingExp / staminaExp) / days)}点体力`;

  const result = totalExperience >= targetExp
    ? ret1
    : ret2;

  console.log(result);
}
