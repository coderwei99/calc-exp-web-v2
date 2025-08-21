# calc-exp-hyrz-v2

火影忍者手游等级经验计算器

## 🎯 项目简介

这是一个专为火影忍者手游玩家设计的等级经验计算工具，帮助玩家科学规划升级路径。项目采用现代化的 React + TypeScript 技术栈构建，提供准确的等级经验计算和直观的升级方案展示。

## ✨ 核心功能

### 🧮 升级计算器
- **智能升级方案计算**：根据当前等级、目标等级和时间范围，精确计算是否能达成目标
- **多维度参数配置**：支持体力购买、月卡、拉面、每日资源等多种参数自定义
- **详细数据展示**：提供每日经验获取明细、体力消耗分析等详细数据
- **实时结果反馈**：计算完成后立即显示升级方案的可行性分析

### 📊 等级经验对照表
- **完整经验数据**：涵盖1-165级的完整经验对照表
- **快速查询功能**：支持等级搜索、一键跳转、回车快捷搜索
- **数据高亮显示**：搜索结果自动高亮，便于快速定位
- **回到顶部**：长表格浏览时的便捷导航功能

### 🎨 用户体验
- **响应式设计**：完美适配桌面、平板、手机等各种设备
- **深色模式支持**：支持明暗主题切换，适应不同使用场景
- **数据持久化**：自动保存用户输入数据，避免重复输入
- **友好的交互反馈**：完整的表单验证和操作提示

## 🏗️ 技术架构

### 整体架构
```
calc-exp-hyrz-v2/
├── apps/web/                    # 前端 Web 应用 (Next.js)
│   ├── app/                     # 应用路由和页面
│   │   ├── page.tsx            # 主页 - 升级计算器
│   │   ├── level-experience/   # 等级经验对照表页面
│   │   └── components/         # 页面专用组件
│   ├── components/             # 通用 UI 组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   ├── calculator/         # 计算器相关组件
│   │   ├── navigation.tsx      # 导航组件
│   │   └── theme-toggle.tsx    # 主题切换
│   ├── lib/                    # 工具函数和常量
│   └── hooks/                  # 自定义 React Hooks
├── packages/core/              # 核心计算库
│   ├── src/
│   │   ├── core.ts            # 主要计算逻辑
│   │   ├── exp.ts             # 经验数据
│   │   ├── types.ts           # 类型定义
│   │   └── utils.ts           # 工具函数
│   └── __test__/              # 单元测试
└── 项目配置文件
```

### 技术栈详情

#### 前端 (apps/web/)
- **框架**: Next.js 13.5 (App Router)
- **语言**: TypeScript 5.2
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Hooks + LocalStorage
- **图标**: Lucide React
- **通知**: Sonner
- **构建工具**: Turbo (Monorepo 管理)

#### 核心库 (packages/core/)
- **语言**: TypeScript 5.7
- **构建**: tsdown (ESM/CJS 双模块支持)
- **测试**: Vitest
- **类型**: 完整的 TypeScript 类型定义

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装与运行
```bash
# 克隆项目
git clone https://github.com/coderwei/calc-exp-hyrz-v2.git
cd calc-exp-hyrz-v2

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 代码检查
pnpm lint
```

### 项目脚本
```bash
# 根目录统一管理脚本
pnpm dev          # 启动所有开发服务
pnpm build        # 构建所有包和应用
pnpm lint         # 代码质量检查

# Web 应用专用 (在 apps/web/ 目录下)
pnpm dev          # 启动 Next.js 开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器

# 核心库专用 (在 packages/core/ 目录下)
pnpm build        # 构建库文件
pnpm test         # 运行单元测试
```

## 📝 使用说明

### 升级计算器使用方法

1. **设置时间范围**：选择计算的开始和结束时间
2. **填写当前状态**：输入当前等级、经验值和目标等级
3. **配置每日资源**：
   - 丰饶之间经验：每日可获得的丰饶经验
   - 每日宝箱经验：每日宝箱获得的经验
4. **设置体力相关**：
   - 影级状态：是否达到影级（影响拉面体力获取）
   - 月卡状态：是否购买月卡
   - 每日体力购买：每天购买体力的次数
5. **每周资源配置**：
   - 每周额外体力：通过活动等获得的额外体力
   - 每周额外经验：通过祈愿等获得的额外经验
6. **体力转换比例**：1点体力能转换的经验值
7. **点击计算**：获得详细的升级方案分析

### 等级经验表使用方法

1. **浏览完整表格**：查看所有等级的经验需求
2. **快速搜索**：在搜索框输入等级号，按回车或点击搜索按钮
3. **数据说明**：
   - 所需经验：升级到下一等级需要的经验
   - 累积经验：达到该等级的总经验需求

## 📊 数据来源

项目使用的等级经验数据来源于游戏官方和玩家社区整理的公开数据：
- [等级经验数据表](https://docs.qq.com/sheet/DR1FCbG5uU3RIZGxm?tab=BB08J2)

所有数据经过验证，确保准确性和时效性。

## 🛠️ 开发指南

### 代码结构说明

#### 核心计算库 (packages/core/)
```typescript
// 主要导出函数
export function canReachTargetExperience(params: ParamsType): CalculationResult

// 参数类型
interface ParamsType {
  currentLevel: number;        // 当前等级
  currentExp: number;          // 当前经验
  targetLevel: number;         // 目标等级
  startTime: string;           // 开始时间
  endTime: string;             // 结束时间
  recoveryPer5Min: number;     // 体力恢复间隔(分钟)
  dailyFixedStamina: number;   // 每日固定体力购买
  extraDailyStamina: number;   // 每日额外体力
  extraDailyExp: number[];     // 每日直接经验获取
  extraStamina: number;        // 周期内额外体力
  staminaExp: number;          // 体力经验转换比例
  extraStaminaExp: number;     // 周期内额外经验
  callback?: Function;         // 计算过程回调
}
```

### 添加新功能

1. **添加新的计算逻辑**：在 `packages/core/src/` 下添加新的计算函数
2. **添加新的 UI 组件**：在 `apps/web/components/` 下创建组件
3. **添加新页面**：在 `apps/web/app/` 下创建新的路由目录

### 测试规范

```bash
# 运行核心库测试
cd packages/core
pnpm test

# 运行测试覆盖率
pnpm test --coverage
```

## 🔧 性能优化建议

### 已实现的优化

#### 前端优化
- **代码分割**：使用 Next.js 自动代码分割
- **图片优化**：配置了图片优化设置
- **懒加载**：大表格使用虚拟滚动（ScrollArea）
- **缓存策略**：LocalStorage 缓存用户输入数据
- **响应式加载**：根据设备类型优化加载策略

#### 核心库优化
- **类型安全**：完整的 TypeScript 类型定义
- **模块化设计**：清晰的模块分离和导出
- **算法优化**：高效的经验计算算法
- **内存管理**：避免内存泄漏的设计模式

### 建议的进一步优化

#### 🚀 性能优化
1. **虚拟化长列表**：
   ```tsx
   // 可考虑使用 react-window 或 react-virtualized
   import { FixedSizeList as List } from 'react-window';
   ```

2. **服务端渲染优化**：
   ```javascript
   // next.config.js
   const nextConfig = {
     experimental: {
       serverComponents: true,
     },
     // 启用 SWC 编译器
     swcMinify: true,
   };
   ```

3. **缓存策略增强**：
   ```typescript
   // 实现计算结果缓存
   const calculateWithCache = useMemo(() => {
     return memoize(canReachTargetExperience);
   }, []);
   ```

#### 📱 用户体验优化
1. **PWA 支持**：添加离线访问能力
2. **数据同步**：实现云端数据同步
3. **快捷操作**：添加键盘快捷键支持
4. **数据导出**：支持计算结果导出为 Excel/PDF

#### 🔒 代码质量优化
1. **单元测试覆盖率**：提升到 90% 以上
2. **端到端测试**：使用 Playwright 添加 E2E 测试
3. **代码规范**：集成 ESLint + Prettier 严格规范
4. **性能监控**：集成 Web Vitals 监控

#### 🎯 功能扩展建议
1. **多语言支持**：国际化 (i18n) 支持
2. **数据可视化**：升级进度图表展示
3. **社区功能**：用户分享升级方案
4. **移动端优化**：专门的移动端交互优化

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范
- 使用语义化的 commit 信息
- 确保代码通过 ESLint 检查
- 添加必要的测试用例
- 更新相关文档

### 开发流程
1. Fork 项目
2. 创建特性分支
3. 完成开发和测试
4. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢火影忍者手游玩家社区提供的数据支持
- 感谢所有贡献者的努力
- 使用了优秀的开源项目：Next.js、Tailwind CSS、shadcn/ui 等
