"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CalculationTips() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm text-gray-600 dark:text-gray-400">计算提示</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p>• 数据会自动保存到本地存储</p>
        <p>• 确保所有必要字段都已填写</p>
        <p>• 体力和经验的周数据会自动转换为日均值</p>
        <p>• 计算将考虑所有游戏机制</p>
        <p>• 结果仅供参考，实际游戏可能有差异</p>
      </CardContent>
    </Card>
  );
}