"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coins, Gift, Users, Zap } from 'lucide-react';

export function GameMechanicsInfo() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <span>游戏机制</span>
        </CardTitle>
        <CardDescription>
          重要的游戏内置规则
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">体力恢复</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">每6分钟恢复1点 (240点/天)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <Coins className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">购买体力</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">50体力/次，最多15次/天</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <Users className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium">体力换经验</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">可自定义转换比例</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}