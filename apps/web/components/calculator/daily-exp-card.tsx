"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift } from 'lucide-react';

interface DailyExpCardProps {
  dailyHarvestExp: string;
  dailyTreasureExp: string;
  onDailyHarvestExpChange: (value: string) => void;
  onDailyTreasureExpChange: (value: string) => void;
}

export function DailyExpCard({
  dailyHarvestExp,
  dailyTreasureExp,
  onDailyHarvestExpChange,
  onDailyTreasureExpChange
}: DailyExpCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Gift className="w-5 h-5 text-green-500" />
          <span>每日经验来源</span>
        </CardTitle>
        <CardDescription>
          根据当前等级输入每日获得的经验
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="daily-harvest">丰饶之间经验/天</Label>
            <Input
              id="daily-harvest"
              type="number"
              placeholder="例：3000"
              value={dailyHarvestExp}
              onChange={(e) => onDailyHarvestExpChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily-treasure">活跃宝箱经验/天</Label>
            <Input
              id="daily-treasure"
              type="number"
              placeholder="例：2000"
              value={dailyTreasureExp}
              onChange={(e) => onDailyTreasureExpChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}