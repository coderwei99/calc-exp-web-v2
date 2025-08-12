"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Gift, Coins, Users } from 'lucide-react';

interface DailyCollectionCardProps {
  isKageLevel: boolean;
  onKageLevelChange: (checked: boolean) => void;
}

export function DailyCollectionCard({ isKageLevel, onKageLevelChange }: DailyCollectionCardProps) {
  const ramenStamina = isKageLevel ? 300 : 150;
  const totalStamina = ramenStamina + 50 + 50; // 拉面 + 铜币 + 好友

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Gift className="w-5 h-5 text-orange-500" />
          <span>每日领取</span>
        </CardTitle>
        <CardDescription>
          每天可以领取的固定体力奖励
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="kage-level" 
            checked={isKageLevel}
            onCheckedChange={onKageLevelChange}
          />
          <Label htmlFor="kage-level" className="text-sm font-medium">
            超影等级
          </Label>
        </div>
        
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-yellow-500" />
                <span>拉面</span>
              </span>
              <Badge variant="secondary" className="text-xs">
                {ramenStamina}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span>铜币</span>
              </span>
              <Badge variant="secondary" className="text-xs">50</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-yellow-500" />
                <span>好友</span>
              </span>
              <Badge variant="secondary" className="text-xs">50</Badge>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center font-medium">
              <span>总计</span>
              <Badge className="text-xs">{totalStamina}</Badge>
            </div>
          </div>
        </div>
        
        {!isKageLevel && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 超影等级可获得额外150点拉面体力
          </p>
        )}
      </CardContent>
    </Card>
  );
}