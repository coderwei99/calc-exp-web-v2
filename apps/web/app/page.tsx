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
import { format, set } from 'date-fns'

import { canReachTargetExperience } from '@calc-exp-hyrz-v2/core'
import { logger } from '@calc-exp-hyrz-v2/core'
import { RECOVERYPER } from '../lib/constants'
import ResultsPanel from './components/results-panel'

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
  hasMonthlyCard: boolean
}

export interface CalculationResult {
  canReachTarget: boolean
  daysNeeded: number
  totalExpNeeded: number
  dailyExpGain: number
  shortfall: number
  staminaEquivalent: number
  dailyExpDetails: {
    date: string
    exp: string | number
    difference: string | number
    currentLevel: any
    dailyExp: string | number
  }[]
}

export default function Home() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [formData, setFormData] = useState<FormData>({
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
    hasMonthlyCard: false,
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
    setHydrated(true) // 标记已加载
  }, [])

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    if (!hydrated) return // 没初始化完成前跳过
    const dataToSave = {
      formData,
      startDate: startDate ? format(startDate!, 'yyyy-MM-dd HH:mm:ss') : undefined,
      endDate: endDate ? format(endDate!, 'yyyy-MM-dd HH:mm:ss') : undefined,
    }
    localStorage.setItem('naruto-calculator-data', JSON.stringify(dataToSave))
    setHydrated(true) // 标记已加载
  }, [formData, startDate, endDate, hydrated])

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
        startDate: format(set(startDate!, { hours: 0, minutes: 0, seconds: 0 })!, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(set(endDate!, { hours: 23, minutes: 59, seconds: 59 })!, 'yyyy-MM-dd HH:mm:ss'),
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
    }

    console.log('=== 火影忍者升级计算器 - 表单数据收集 ===')
    console.log('收集时间:', new Date().toLocaleString())
    console.log('完整数据:', calculationData)
    console.log('==========================================')

    return calculationData
  }
  const handleCalculate = async () => {
    // Validation
    if (!startDate || !endDate) {
      toast.error('请选择开始和结束时间')
      return
    }

    if (endDate <= startDate) {
      toast.error('结束时间必须晚于开始时间')
      return
    }

    const { weeklyResources, timeRange, staminaSystem, dailyExpSources, currentStatus } = collectFormData()

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

    const { canReachTarget, totalExpNeeded, dailyExpGain, shortfall, staminaEquivalent, dailyExpDetails } =
      canReachTargetExperience({
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
      staminaEquivalent: Number(staminaEquivalent),
      dailyExpGain: Number(dailyExpGain),
      shortfall: Number(shortfall),
      dailyExpDetails,
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
                  hasMonthlyCard={formData.hasMonthlyCard}
                  onKageLevelChange={(checked) => handleInputChange('isKageLevel', checked)}
                  onMonthlyCardChange={(checked) => handleInputChange('hasMonthlyCard', checked)}
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
            <ResultsPanel resetCalculation={resetCalculation} calculationResult={calculationResult} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
