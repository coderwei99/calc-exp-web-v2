'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator } from 'lucide-react'

interface CurrentStatusCardProps {
  currentLevel: string
  currentExp: string
  targetLevel: string
  onCurrentLevelChange: (value: string) => void
  onCurrentExpChange: (value: string) => void
  onTargetLevelChange: (value: string) => void
}

export function CurrentStatusCard({
  currentLevel,
  currentExp,
  targetLevel,
  onCurrentLevelChange,
  onCurrentExpChange,
  onTargetLevelChange,
}: CurrentStatusCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          <span>当前状态</span>
        </CardTitle>
        <CardDescription>输入当前等级信息和目标</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-level">当前等级</Label>
            <Input
              id="current-level"
              type="number"
              placeholder="例：65"
              value={currentLevel}
              onChange={(e) => onCurrentLevelChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-exp">当前经验</Label>
            <Input
              id="current-exp"
              type="number"
              placeholder="例：15000"
              value={currentExp}
              onChange={(e) => onCurrentExpChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-level">目标等级</Label>
            <Input
              id="target-level"
              type="number"
              placeholder="例：70"
              value={targetLevel}
              onChange={(e) => onTargetLevelChange(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
