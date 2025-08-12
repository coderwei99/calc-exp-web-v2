# 项目介绍

主要用于计算两个时间节点火影忍者手游能否达到目标等级

## 参数介绍
```typescript
interface ParamsType {
    currentLevel: number; // 当前等级
    targetLevel?: number; // 目标等级, 默认110
    currentExp: number; // 当前拥有经验
    startTime: string; // 开始时间 格式为`2025-01-4 10:00:00`
    endTime: string; // 结束时间 格式同上,
    recoveryPer5Min: number; // 多少分钟恢复一点体力 当前版本是6分钟1点体力,
    dailyFixedStamina: number; // 每天固定买多少体力,
    extraDailyStamina: number; // 每天额外能够获得的体力(拉面/好友/月卡/铜币),
    extraDailyExp: number[]; // 每天直接获得的经验值(丰饶/宝箱),
    extraStamina: number; // 这个时间周期内通过游戏外或者游戏内直接/间接能获得的体力 比如说碰上体力特惠7天多获取的体力,
    staminaExp: number; // 1点体力等级换算成的经验值,
    extraStaminaExp: number; // 同上 直接间接获取的经验值 比如说每周祈愿获得的经验值 一周只有一次,
    callback: (startTime: string, endTime: string, expDiff: number, totalExperience: number, days: number, staminaExp: number) => void; // 回调 如果输出计算的结果
  }
```
> 警告: 开始时间的时分秒如果大于结束时间的时分秒,会导致计算出来的天数少一天,进而导致计算不精准,
```javascript
const startTime = '2025-01-4 12:00:00'
const endTime = '2025-01-4 12:00:00'

// 他们的天数差不满足24小时 所以直接认为是0 意味着不会计算自然恢复体力 & 丰饶宝箱等 可自行检查输出的days的正确性
```