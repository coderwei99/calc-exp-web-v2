'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart } from 'lucide-react'
import { MAX_DAILY_STAMINA_PURCHASE } from '../../lib/constants'

interface DailyStaminaCardProps {
  dailyStaminaPurchase: string
  onDailyStaminaPurchaseChange: (value: string) => void
}

export function DailyStaminaCard({ dailyStaminaPurchase, onDailyStaminaPurchaseChange }: DailyStaminaCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-indigo-500" />
          <span>每日购买体力</span>
        </CardTitle>
        <CardDescription>
          每天可以购买体力，但有上限（单位：50体力/次，最多{MAX_DAILY_STAMINA_PURCHASE}次/天）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="daily-stamina-purchase">购买次数/天</Label>
          <Select value={dailyStaminaPurchase} onValueChange={onDailyStaminaPurchaseChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择每天购买次数" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: MAX_DAILY_STAMINA_PURCHASE + 1 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i}次/天 {i > 0 && `(${i * 50}体力/天)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {dailyStaminaPurchase && Number(dailyStaminaPurchase) > 0 && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              合计: {Number(dailyStaminaPurchase) * 50} 体力/天
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
