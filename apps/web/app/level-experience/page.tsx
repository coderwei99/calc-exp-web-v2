'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, ArrowUp, Table as TableIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Navigation } from '@/components/navigation'
import { getLevelTableData, type LevelData } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Footer } from '../../components/footer'

export default function LevelExperiencePage() {
  const [searchLevel, setSearchLevel] = useState('')
  const [highlightedLevel, setHighlightedLevel] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const levelData = getLevelTableData()

  const handleSearch = () => {
    if (!searchLevel.trim()) {
      toast.error('请输入等级')
      return
    }

    const level = parseInt(searchLevel)
    if (isNaN(level) || level < 1 || level > 165) {
      toast.error('请输入1-165之间的等级')
      return
    }

    scrollToLevel(level)
    setHighlightedLevel(level)

    // Auto-remove highlight after 0.5s
    setTimeout(() => {
      // setHighlightedLevel(null)
    }, 500)
  }

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (!scrollArea) return

    const handleScroll = () => {
      setShowBackToTop(scrollArea.scrollTop > 300)
    }

    scrollArea.addEventListener('scroll', handleScroll)
    return () => scrollArea.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToLevel = (level: number) => {
    const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (!scrollArea) return

    // Find the target row element
    const targetRow = scrollArea.querySelector(`[data-level="${level}"]`)
    if (!targetRow) return

    // Get the position of the target row relative to the scroll container
    const containerRect = scrollArea.getBoundingClientRect()
    const targetRect = targetRow.getBoundingClientRect()
    const currentScrollTop = scrollArea.scrollTop

    // Calculate the target scroll position to center the row
    const targetScrollTop =
      currentScrollTop + (targetRect.top - containerRect.top) - containerRect.height / 2 + targetRect.height / 2

    scrollArea.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth',
    })
  }

  const scrollToTop = () => {
    const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (scrollArea) {
      scrollArea.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Navigation />
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TableIcon className="w-6 h-6 text-orange-500" />
              <span>等级经验对照表</span>
            </CardTitle>
            <CardDescription>升级下一等级所需经验，以及累积经验总和。本表格数据来源于公开资源。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="输入等级 (1-165)"
                  value={searchLevel}
                  onChange={(e) => setSearchLevel(e.target.value)}
                  className="pl-10 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchLevel.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                搜索
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <a
                  href="https://docs.qq.com/sheet/DR1FCbG5uU3RIZGxm?tab=BB08J2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  数据来源
                </a>
              </span>
            </div>

            {/* Table */}
            <div className="relative" ref={tableRef}>
              {/* Fixed Header */}
              <div className="bg-gray-50 dark:bg-gray-800 border rounded-t-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48 text-center font-semibold">等级</TableHead>
                      <TableHead className="text-center font-semibold">所需经验</TableHead>
                      <TableHead className="text-center font-semibold">累积经验</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Body */}
              <ScrollArea className="h-[600px] w-full border-x border-b rounded-b-md" ref={scrollAreaRef}>
                <Table>
                  <TableBody>
                    {levelData.map((data) => (
                      <TableRow
                        key={data.level}
                        data-level={data.level}
                        className={cn(
                          'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                          highlightedLevel === data.level &&
                            'border-2 border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                        )}
                      >
                        <TableCell className="w-48 text-center font-medium">
                          Lv{data.level}
                          {data.level < 165 && <span className="text-gray-400 text-sm ml-1">→ Lv{data.level + 1}</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {data.level === 165 ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            formatNumber(data.expRequired)
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {data.level === 165 ? <span className="text-gray-400">-</span> : formatNumber(data.totalExp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {/* Back to Top Button */}
              {showBackToTop && (
                <Button
                  onClick={scrollToTop}
                  size="sm"
                  className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg bg-orange-500 hover:bg-orange-600 text-white z-50"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <strong>说明:</strong> 升级所需经验 = EXP[Lv] - EXP[Lv-1]，表格显示下一等级所需经验值。
              </p>
              <p>
                <strong>备注:</strong> 现阶段165级为满级，已无法继续升级。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
