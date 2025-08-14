import { Mail, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto px-4 py-8 space-y-2">
        {/* 版权信息 */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>© 2025 火影忍者工具箱</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>by coderwei</span>
          </span>
        </div>

        {/* 联系信息 */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">联系邮箱：</span>
          <a
            href="mailto:916606569@qq.com"
            className="text-sky-500 hover:text-primary/80 transition-colors font-medium"
          >
            916606569@qq.com
          </a>
        </div>

        {/* 反馈提示 */}
        <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="flex items-center justify-center leading-relaxed">
            💡 如果使用过程中发现问题或者有什么建议，欢迎发送到联系邮箱
          </p>
          <p className="flex items-center justify-center text-xs mt-2 opacity-75">您的反馈将帮助我们不断改进产品体验</p>
        </div>

        {/* tips */}
        <div className="flex items-center justify-center text-xs text-muted-foreground/70 space-x-2">
          木叶飞舞之处，火亦生生不息
        </div>
      </div>
    </footer>
  )
}
