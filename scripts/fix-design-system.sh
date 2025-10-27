#!/bin/bash

# Design System 批量修复脚本
# 根据 DESIGN_SYSTEM_AUDIT_REPORT.md 进行批量颜色替换

echo "🎬 开始修复设计系统不符合项..."

# 定义要修复的文件列表
FILES=(
  "src/components/History.tsx"
  "src/components/LoginModal.tsx"
  "src/components/UsageCounter.tsx"
  "src/components/SubscriptionPlans.tsx"
  "src/components/ConfirmModal.tsx"
  "src/components/SortDropdown.tsx"
  "src/components/LoginPrompt.tsx"
  "src/components/RegisterPromptModal.tsx"
  "src/components/UpgradeModal.tsx"
  "src/components/SubscriptionBadge.tsx"
  "src/components/ConflictResolutionModal.tsx"
  "src/components/ThemeToggle.tsx"
  "src/components/Toast.tsx"
)

# 备份文件
echo "📦 创建备份..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$file.backup"
  fi
done

# 批量颜色替换
echo "🎨 执行颜色令牌替换..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  处理: $file"

    # 背景色替换
    sed -i '' -e 's/bg-white\([^-]\)/bg-scene-fill\1/g' "$file" 2>/dev/null || sed -i 's/bg-white\([^-]\)/bg-scene-fill\1/g' "$file"
    sed -i '' -e 's/"bg-white"/"bg-scene-fill"/g' "$file" 2>/dev/null || sed -i 's/"bg-white"/"bg-scene-fill"/g' "$file"

    # 文本颜色替换
    sed -i '' -e 's/text-gray-900/text-text-primary/g' "$file" 2>/dev/null || sed -i 's/text-gray-900/text-text-primary/g' "$file"
    sed -i '' -e 's/text-gray-800/text-text-primary/g' "$file" 2>/dev/null || sed -i 's/text-gray-800/text-text-primary/g' "$file"
    sed -i '' -e 's/text-gray-700/text-text-secondary/g' "$file" 2>/dev/null || sed -i 's/text-gray-700/text-text-secondary/g' "$file"
    sed -i '' -e 's/text-gray-600/text-text-secondary/g' "$file" 2>/dev/null || sed -i 's/text-gray-600/text-text-secondary/g' "$file"
    sed -i '' -e 's/text-gray-500/text-text-tertiary/g' "$file" 2>/dev/null || sed -i 's/text-gray-500/text-text-tertiary/g' "$file"
    sed -i '' -e 's/text-gray-400/text-text-tertiary/g' "$file" 2>/dev/null || sed -i 's/text-gray-400/text-text-tertiary/g' "$file"

    # 边框颜色替换
    sed -i '' -e 's/border-gray-300/border-keyLight\/20/g' "$file" 2>/dev/null || sed -i 's/border-gray-300/border-keyLight\/20/g' "$file"
    sed -i '' -e 's/border-gray-200/border-keyLight\/20/g' "$file" 2>/dev/null || sed -i 's/border-gray-200/border-keyLight\/20/g' "$file"
    sed -i '' -e 's/border-gray-100/border-keyLight\/10/g' "$file" 2>/dev/null || sed -i 's/border-gray-100/border-keyLight\/10/g' "$file"

    # Primary 颜色替换
    sed -i '' -e 's/text-primary-600/text-keyLight/g' "$file" 2>/dev/null || sed -i 's/text-primary-600/text-keyLight/g' "$file"
    sed -i '' -e 's/text-primary-700/text-keyLight/g' "$file" 2>/dev/null || sed -i 's/text-primary-700/text-keyLight/g' "$file"
    sed -i '' -e 's/bg-primary-600/bg-keyLight/g' "$file" 2>/dev/null || sed -i 's/bg-primary-600/bg-keyLight/g' "$file"
    sed -i '' -e 's/bg-primary-700/bg-keyLight-600/g' "$file" 2>/dev/null || sed -i 's/bg-primary-700/bg-keyLight-600/g' "$file"
    sed -i '' -e 's/border-primary-600/border-keyLight/g' "$file" 2>/dev/null || sed -i 's/border-primary-600/border-keyLight/g' "$file"

    # 状态颜色替换 - Green
    sed -i '' -e 's/bg-green-50/bg-state-ok\/10/g' "$file" 2>/dev/null || sed -i 's/bg-green-50/bg-state-ok\/10/g' "$file"
    sed -i '' -e 's/text-green-600/text-state-ok/g' "$file" 2>/dev/null || sed -i 's/text-green-600/text-state-ok/g' "$file"
    sed -i '' -e 's/text-green-700/text-state-ok/g' "$file" 2>/dev/null || sed -i 's/text-green-700/text-state-ok/g' "$file"
    sed -i '' -e 's/border-green-200/border-state-ok\/30/g' "$file" 2>/dev/null || sed -i 's/border-green-200/border-state-ok\/30/g' "$file"

    # 状态颜色替换 - Red
    sed -i '' -e 's/bg-red-50/bg-state-error\/10/g' "$file" 2>/dev/null || sed -i 's/bg-red-50/bg-state-error\/10/g' "$file"
    sed -i '' -e 's/text-red-600/text-state-error/g' "$file" 2>/dev/null || sed -i 's/text-red-600/text-state-error/g' "$file"
    sed -i '' -e 's/text-red-700/text-state-error/g' "$file" 2>/dev/null || sed -i 's/text-red-700/text-state-error/g' "$file"
    sed -i '' -e 's/text-red-800/text-state-error/g' "$file" 2>/dev/null || sed -i 's/text-red-800/text-state-error/g' "$file"
    sed -i '' -e 's/text-red-900/text-state-error/g' "$file" 2>/dev/null || sed -i 's/text-red-900/text-state-error/g' "$file"
    sed -i '' -e 's/border-red-200/border-state-error\/30/g' "$file" 2>/dev/null || sed -i 's/border-red-200/border-state-error\/30/g' "$file"
    sed -i '' -e 's/bg-red-600/bg-state-error/g' "$file" 2>/dev/null || sed -i 's/bg-red-600/bg-state-error/g' "$file"
    sed -i '' -e 's/hover:bg-red-700/hover:bg-state-error\/80/g' "$file" 2>/dev/null || sed -i 's/hover:bg-red-700/hover:bg-state-error\/80/g' "$file"

    # 状态颜色替换 - Orange/Yellow
    sed -i '' -e 's/bg-orange-50/bg-state-warning\/10/g' "$file" 2>/dev/null || sed -i 's/bg-orange-50/bg-state-warning\/10/g' "$file"
    sed -i '' -e 's/text-orange-600/text-state-warning/g' "$file" 2>/dev/null || sed -i 's/text-orange-600/text-state-warning/g' "$file"
    sed -i '' -e 's/text-orange-700/text-state-warning/g' "$file" 2>/dev/null || sed -i 's/text-orange-700/text-state-warning/g' "$file"
    sed -i '' -e 's/text-orange-800/text-state-warning/g' "$file" 2>/dev/null || sed -i 's/text-orange-800/text-state-warning/g' "$file"
    sed -i '' -e 's/text-orange-900/text-state-warning/g' "$file" 2>/dev/null || sed -i 's/text-orange-900/text-state-warning/g' "$file"
    sed -i '' -e 's/border-orange-200/border-state-warning\/30/g' "$file" 2>/dev/null || sed -i 's/border-orange-200/border-state-warning\/30/g' "$file"
    sed -i '' -e 's/border-orange-300/border-state-warning\/30/g' "$file" 2>/dev/null || sed -i 's/border-orange-300/border-state-warning\/30/g' "$file"
    sed -i '' -e 's/bg-orange-600/bg-state-warning/g' "$file" 2>/dev/null || sed -i 's/bg-orange-600/bg-state-warning/g' "$file"
    sed -i '' -e 's/hover:bg-orange-700/hover:bg-state-warning\/80/g' "$file" 2>/dev/null || sed -i 's/hover:bg-orange-700/hover:bg-state-warning\/80/g' "$file"

    # 状态颜色替换 - Blue
    sed -i '' -e 's/bg-blue-50/bg-state-info\/10/g' "$file" 2>/dev/null || sed -i 's/bg-blue-50/bg-state-info\/10/g' "$file"
    sed -i '' -e 's/text-blue-600/text-state-info/g' "$file" 2>/dev/null || sed -i 's/text-blue-600/text-state-info/g' "$file"
    sed -i '' -e 's/text-blue-700/text-state-info/g' "$file" 2>/dev/null || sed -i 's/text-blue-700/text-state-info/g' "$file"
    sed -i '' -e 's/text-blue-800/text-state-info/g' "$file" 2>/dev/null || sed -i 's/text-blue-800/text-state-info/g' "$file"
    sed -i '' -e 's/text-blue-900/text-state-info/g' "$file" 2>/dev/null || sed -i 's/text-blue-900/text-state-info/g' "$file"
    sed -i '' -e 's/border-blue-200/border-state-info\/30/g' "$file" 2>/dev/null || sed -i 's/border-blue-200/border-state-info\/30/g' "$file"

    # 背景灰色替换
    sed -i '' -e 's/bg-gray-50/bg-scene-fillLight/g' "$file" 2>/dev/null || sed -i 's/bg-gray-50/bg-scene-fillLight/g' "$file"
    sed -i '' -e 's/bg-gray-100/bg-scene-fillLight/g' "$file" 2>/dev/null || sed -i 's/bg-gray-100/bg-scene-fillLight/g' "$file"
    sed -i '' -e 's/bg-gray-200/bg-scene-fillLight/g' "$file" 2>/dev/null || sed -i 's/bg-gray-200/bg-scene-fillLight/g' "$file"

    # Loading 状态替换
    sed -i '' -e 's/border-b-2 border-primary-600/border-2 border-neon border-t-transparent/g' "$file" 2>/dev/null || sed -i 's/border-b-2 border-primary-600/border-2 border-neon border-t-transparent/g' "$file"
    sed -i '' -e 's/border-2 border-primary-600/border-2 border-neon/g' "$file" 2>/dev/null || sed -i 's/border-2 border-primary-600/border-2 border-neon/g' "$file"

    # 阴影替换
    sed -i '' -e 's/shadow-lg/shadow-depth-lg/g' "$file" 2>/dev/null || sed -i 's/shadow-lg/shadow-depth-lg/g' "$file"
    sed -i '' -e 's/shadow-md/shadow-depth-md/g' "$file" 2>/dev/null || sed -i 's/shadow-md/shadow-depth-md/g' "$file"
    sed -i '' -e 's/shadow-2xl/shadow-key/g' "$file" 2>/dev/null || sed -i 's/shadow-2xl/shadow-key/g' "$file"

    # Focus ring 替换
    sed -i '' -e 's/ring-blue-500/ring-keyLight\/20/g' "$file" 2>/dev/null || sed -i 's/ring-blue-500/ring-keyLight\/20/g' "$file"
    sed -i '' -e 's/ring-primary-500/ring-keyLight\/20/g' "$file" 2>/dev/null || sed -i 's/ring-primary-500/ring-keyLight\/20/g' "$file"

  fi
done

echo "✅ 颜色令牌替换完成！"
echo ""
echo "📝 已修复的文件:"
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  fi
done

echo ""
echo "🔍 备份文件位于: *.backup"
echo "💡 如需回滚，执行: for f in src/components/*.backup; do mv \$f \${f%.backup}; done"
