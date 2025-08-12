"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface WeeklyResourcesCardProps {
  weeklyStamina: string;
  weeklyExp: string;
  onWeeklyStaminaChange: (value: string) => void;
  onWeeklyExpChange: (value: string) => void;
}

export function WeeklyResourcesCard({
  weeklyStamina,
  weeklyExp,
  onWeeklyStaminaChange,
  onWeeklyExpChange
}: WeeklyResourcesCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <span>每周资源获取</span>
        </CardTitle>
        <CardDescription>
          以周为单位的资源获取（将自动转换为日均值）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weekly-stamina">体力获取/周</Label>
            <Input
              id="weekly-stamina"
              type="number"
              placeholder="例：1000"
              value={weeklyStamina}
              onChange={(e) => onWeeklyStaminaChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            {weeklyStamina && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                日均: {Math.round(Number(weeklyStamina) / 7 * 100) / 100} 体力
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekly-exp">经验获取/周</Label>
            <Input
              id="weekly-exp"
              type="number"
              placeholder="例：5000"
              value={weeklyExp}
              onChange={(e) => onWeeklyExpChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            {weeklyExp && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                日均: {Math.round(Number(weeklyExp) / 7 * 100) / 100} 经验
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}