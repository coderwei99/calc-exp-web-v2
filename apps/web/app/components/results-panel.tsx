'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TrendingUp, Award, Target, ListCollapse } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalculationResult } from '../page'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ResultsPanel({
  resetCalculation,
  calculationResult,
}: {
  resetCalculation: () => void
  calculationResult: CalculationResult | null
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
          计算结果
        </h2>
        <Button variant="outline" onClick={resetCalculation} className="hover:bg-gray-100 dark:hover:bg-gray-800">
          返回编辑
        </Button>
      </div>

      {calculationResult && (
        <div className="space-y-6">
          {/* Result Summary */}
          <Card
            className={cn(
              'border-2',
              calculationResult.canReachTarget
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {calculationResult.canReachTarget ? (
                  <Award className="w-8 h-8 text-green-500" />
                ) : (
                  <Target className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <h3 className="text-xl font-bold">
                    {calculationResult.canReachTarget ? '可以达到目标！' : '无法达到目标'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {calculationResult.canReachTarget
                      ? `预计需要 ${calculationResult.daysNeeded} 天`
                      : `还差 ${calculationResult.shortfall.toLocaleString()} 经验`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">所需经验</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {calculationResult.totalExpNeeded.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">日均经验获取</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {calculationResult.dailyExpGain.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">预计天数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {calculationResult.daysNeeded}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                  {calculationResult.shortfall > 0 ? '经验缺口 / 折合体力' : '经验溢出 / 折合体力'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    'text-2xl font-bold',
                    calculationResult.shortfall > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  )}
                >
                  {Math.abs(calculationResult.shortfall).toLocaleString()} {' / '}
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {Math.abs(calculationResult.staminaEquivalent).toLocaleString()}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ListCollapse className="w-6 h-6 mr-2 text-green-500" />
          详情
        </h2>
      </div>

      <ScrollArea className="h-[600px] w-full rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-48 text-center font-semibold">日期</TableHead>
              <TableHead className="text-center font-semibold">当前等级</TableHead>
              <TableHead className="text-center font-semibold">当前经验</TableHead>
              <TableHead className="text-center font-semibold">所差总经验</TableHead>
              <TableHead className="text-center font-semibold">日均经验</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculationResult?.dailyExpDetails.map((data) => (
              <TableRow
                key={data.date}
                data-level={data.date}
                className={cn('hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors')}
              >
                <TableCell className="text-center font-medium">{data.date}</TableCell>
                <TableCell className="text-center">{data.currentLevel}</TableCell>
                <TableCell className="text-center">{data.exp}</TableCell>
                <TableCell className="text-center">{data.difference}</TableCell>
                <TableCell className="text-center">{data.dailyExp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
