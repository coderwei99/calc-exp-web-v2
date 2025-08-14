'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calculator, TrendingUp, Award, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { TimePeriodCard } from '@/components/calculator/time-period-card'
import { CurrentStatusCard } from '@/components/calculator/current-status-card'
import { DailyExpCard } from '@/components/calculator/daily-exp-card'
import { DailyStaminaCard } from '@/components/calculator/daily-stamina-card'
import { WeeklyResourcesCard } from '@/components/calculator/weekly-resources-card'
import { ConversionRateCard } from '@/components/calculator/conversion-rate-card'
import { DailyCollectionCard } from '@/components/calculator/daily-collection-card'
import { GameMechanicsInfo } from '@/components/calculator/game-mechanics-info'
import { CalculationTips } from '@/components/calculator/calculation-tips'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { canReachTargetExperience } from '@calc-exp-hyrz-v2/core'
import { logger } from '@calc-exp-hyrz-v2/core'
import { RECOVERYPER } from '../lib/constants'

interface FormData {
  currentLevel: string
  currentExp: string
  targetLevel: string
  dailyHarvestExp: string
  dailyTreasureExp: string
  weeklyStamina: string
  weeklyExp: string
  staminaToExpRatio: string
  dailyStaminaPurchase: string
  isKageLevel: boolean
}

interface CalculationResult {
  canReachTarget: boolean
  daysNeeded: number
  totalExpNeeded: number
  dailyExpGain: number
  shortfall: number
}

export default function Home() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('naruto-calculator-data')
      if (savedData) {
        return JSON.parse(savedData).formData
      }
    }
    return {
      currentLevel: '',
      currentExp: '',
      targetLevel: '',
      dailyHarvestExp: '',
      dailyTreasureExp: '',
      weeklyStamina: '',
      weeklyExp: '',
      staminaToExpRatio: '',
      dailyStaminaPurchase: '',
      isKageLevel: false,
    }
  })
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('naruto-calculator-data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.formData) setFormData(parsed.formData)
        if (parsed.startDate) setStartDate(new Date(parsed.startDate))
        if (parsed.endDate) setEndDate(new Date(parsed.endDate))
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    console.log('startDate', startDate)

    const dataToSave = {
      formData,
      startDate: startDate ? format(startDate!, 'yyyy-MM-dd HH:mm:ss') : undefined,
      endDate: endDate ? format(endDate!, 'yyyy-MM-dd HH:mm:ss') : undefined,
    }
    localStorage.setItem('naruto-calculator-data', JSON.stringify(dataToSave))
  }, [formData, startDate, endDate])

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const collectFormData = () => {
    const ramenStamina = formData.isKageLevel ? 300 : 150
    const fixedDailyStamina = ramenStamina + 50 + 50 // 拉面 + 铜币 + 好友
    const naturalStaminaPerDay = 240 // 每6分钟1点，24小时=240点

    const calculationData = {
      timeRange: {
        startDate: format(startDate!, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(endDate!, 'yyyy-MM-dd HH:mm:ss'),
        totalDays:
          startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      },
      currentStatus: {
        currentLevel: Number(formData.currentLevel) || 0,
        currentExp: Number(formData.currentExp) || 0,
        targetLevel: Number(formData.targetLevel) || 0,
      },
      dailyExpSources: {
        harvestExp: Number(formData.dailyHarvestExp) || 0,
        treasureExp: Number(formData.dailyTreasureExp) || 0,
      },
      weeklyResources: {
        weeklyStamina: Number(formData.weeklyStamina) || 0,
        weeklyExp: Number(formData.weeklyExp) || 0,
        dailyStaminaFromWeekly: Math.round(((Number(formData.weeklyStamina) || 0) / 7) * 100) / 100,
        dailyExpFromWeekly: Math.round(((Number(formData.weeklyExp) || 0) / 7) * 100) / 100,
      },
      staminaSystem: {
        staminaToExpRatio: Number(formData.staminaToExpRatio) || 0,
        dailyStaminaPurchase: Number(formData.dailyStaminaPurchase) || 0,
        purchasedStaminaPerDay: (Number(formData.dailyStaminaPurchase) || 0) * 50,
        fixedDailyStamina: fixedDailyStamina,
        naturalStaminaPerDay: naturalStaminaPerDay,
        isKageLevel: formData.isKageLevel,
      },
      calculatedTotals: {
        totalDailyExp:
          (Number(formData.dailyHarvestExp) || 0) +
          (Number(formData.dailyTreasureExp) || 0) +
          Math.round(((Number(formData.weeklyExp) || 0) / 7) * 100) / 100,
        totalDailyStamina:
          fixedDailyStamina +
          naturalStaminaPerDay +
          (Number(formData.dailyStaminaPurchase) || 0) * 50 +
          Math.round(((Number(formData.weeklyStamina) || 0) / 7) * 100) / 100,
        totalDailyExpFromStamina:
          (fixedDailyStamina +
            naturalStaminaPerDay +
            (Number(formData.dailyStaminaPurchase) || 0) * 50 +
            Math.round(((Number(formData.weeklyStamina) || 0) / 7) * 100) / 100) *
          (Number(formData.staminaToExpRatio) || 0),
      },
    }

    console.log('=== 火影忍者升级计算器 - 表单数据收集 ===')
    console.log('收集时间:', new Date().toLocaleString())
    console.log('完整数据:', calculationData)
    console.log('==========================================')

    return calculationData
  }
  const handleCalculate = async () => {
    // Validation
    if (!startDate || !startDate) {
      toast.error('请选择开始和结束时间')
      return
    }

    const { weeklyResources, timeRange, staminaSystem, dailyExpSources, currentStatus, calculatedTotals } =
      collectFormData()

    if (!currentStatus.currentLevel || !currentStatus.targetLevel) {
      toast.error('请输入当前等级和目标等级')
      return
    }

    if (currentStatus.currentLevel >= currentStatus.targetLevel) {
      toast.error('目标等级必须大于当前等级')
      return
    }
    setIsCalculating(true)
    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { canReachTarget, totalExpNeeded, dailyExpGain, shortfall } = canReachTargetExperience({
      currentLevel: currentStatus.currentLevel,
      currentExp: currentStatus.currentExp,
      targetLevel: currentStatus.targetLevel,
      startTime: timeRange.startDate,
      endTime: timeRange.endDate,
      recoveryPer5Min: RECOVERYPER,
      dailyFixedStamina: staminaSystem.dailyStaminaPurchase,
      extraDailyStamina: staminaSystem.fixedDailyStamina,
      extraDailyExp: [dailyExpSources.harvestExp, dailyExpSources.treasureExp],
      extraStamina: weeklyResources.weeklyStamina,
      extraStaminaExp: weeklyResources.weeklyExp,
      staminaExp: staminaSystem.staminaToExpRatio,
      callback: logger,
    })

    // Mock calculation result
    const mockResult: CalculationResult = {
      canReachTarget,
      daysNeeded: Math.floor(Math.random() * timeRange.totalDays) + 1,
      totalExpNeeded,
      dailyExpGain,
      shortfall,
    }
    console.log('mockResult', mockResult)

    setCalculationResult(mockResult)
    setIsCalculating(false)
    setShowResults(true)
    const tbody = document.querySelector('body')!
    tbody.style.overflow = 'hidden'

    toast.success('计算完成！')
  }

  const resetCalculation = () => {
    setShowResults(false)
    const tbody = document.querySelector('body')!
    tbody.style.overflow = ''
    setCalculationResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Navigation />
          <ThemeToggle />
        </div>

        <div className="relative overflow-hidden">
          {/* Main Content */}
          <div
            className={cn(
              'transition-all duration-700 ease-in-out',
              showResults ? '-translate-x-full opacity-0 ' : 'translate-x-0 opacity-100'
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <TimePeriodCard
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />

                <CurrentStatusCard
                  currentLevel={formData.currentLevel}
                  currentExp={formData.currentExp}
                  targetLevel={formData.targetLevel}
                  onCurrentLevelChange={(value) => handleInputChange('currentLevel', value)}
                  onCurrentExpChange={(value) => handleInputChange('currentExp', value)}
                  onTargetLevelChange={(value) => handleInputChange('targetLevel', value)}
                />

                <DailyExpCard
                  dailyHarvestExp={formData.dailyHarvestExp}
                  dailyTreasureExp={formData.dailyTreasureExp}
                  onDailyHarvestExpChange={(value) => handleInputChange('dailyHarvestExp', value)}
                  onDailyTreasureExpChange={(value) => handleInputChange('dailyTreasureExp', value)}
                />

                <DailyCollectionCard
                  isKageLevel={formData.isKageLevel}
                  onKageLevelChange={(checked) => handleInputChange('isKageLevel', checked)}
                />

                <DailyStaminaCard
                  dailyStaminaPurchase={formData.dailyStaminaPurchase}
                  onDailyStaminaPurchaseChange={(value) => handleInputChange('dailyStaminaPurchase', value)}
                />

                <WeeklyResourcesCard
                  weeklyStamina={formData.weeklyStamina}
                  weeklyExp={formData.weeklyExp}
                  onWeeklyStaminaChange={(value) => handleInputChange('weeklyStamina', value)}
                  onWeeklyExpChange={(value) => handleInputChange('weeklyExp', value)}
                />

                <ConversionRateCard
                  staminaToExpRatio={formData.staminaToExpRatio}
                  onStaminaToExpRatioChange={(value) => handleInputChange('staminaToExpRatio', value)}
                />

                {/* Calculate Button */}
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      计算中...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      开始计算升级方案
                    </>
                  )}
                </Button>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <GameMechanicsInfo />
                <CalculationTips />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div
            className={cn(
              'fixed inset-0 transition-all duration-700 ease-in-out flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 z-50',
              showResults ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            )}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
                  计算结果
                </h2>
                <Button
                  variant="outline"
                  onClick={resetCalculation}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
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
                        <CardTitle className="text-sm text-gray-600 dark:text-gray-400">经验缺口</CardTitle>
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
                          {calculationResult.shortfall > 0 ? calculationResult.shortfall.toLocaleString() : '无缺口'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
