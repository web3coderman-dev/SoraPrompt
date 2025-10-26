# 📄 SoraPrompt Subscription System PRD

**Version:** v2.2
**Owner:** Alex
**Platform:** bolt.new
**Goal:** 实现多层级订阅与次数计费系统，为 SoraPrompt 提供平权式 AI 生成体验。

---

## 🧭 1. 概述（Overview）

SoraPrompt 是一款影视级 AI Prompt 生成器，允许用户以自然语言生成高质量的电影级 prompt 与脚本。
本订阅系统旨在提供 **统一AI体验**（所有用户使用同一优化模型），但通过“使用次数 + 身份徽章”形成层级差异。

---

## 🎯 2. 功能目标（Objectives）

* 提供 3 个订阅层级：Free / Creator / Director。
* 所有用户共享同一 Prompt 优化与脚本生成引擎。
* 按「生成次数」控制使用上限。
* 每个版本均支持快速生成模式；Creator 与 Director 额外支持导演生成模式。
* 每个版本均支持历史记录无限保存。
* 支持身份徽章（UI标识层级）。

---

## 🧩 3. 功能结构（Feature Structure）

| 模块                        | 描述               |
| ------------------------- | ---------------- |
| Subscription Management   | 订阅层级定义、次数额度、权限逻辑 |
| Usage Tracking            | 计次系统（每日/每月上限）    |
| Mode Control              | 不同层级对应可用生成模式     |
| Badge System              | 身份徽章渲染逻辑         |
| History Management        | 用户生成历史无限保存       |
| Prompt Engine Integration | 所有层级调用统一AI模型接口   |
| Upgrade Flow              | 升级弹窗与 CTA 行为     |

---

## 🪙 4. 层级定义（Subscription Tiers）

| 等级                   | 名称    | 定价         | 次数上限                       | 模式支持  | 历史记录            | 身份徽章 | 响应优先级 |
| -------------------- | ----- | ---------- | -------------------------- | ----- | ---------- | --------------- | ---- | ----- |
| 🆓 **Free Plan**     | $0    | 每日3次（每日重置） | ✅ 快速生成                     | ✅ 同模型 | ✅ 无限保存     | ⚪️ 普通徽章         | 普通   |       |
| ⚡️ **Creator Plan**  | $19/月 | 每月1000次    | ✅ 快速生成<br>✅ 导演生成（完整版+分镜脚本） | ✅ 同模型 | ✅ 无限保存     | 🟢 尊贵Creator徽章  | 标准   |       |
| 🎥 **Director Plan** | $49/月 | 每月3000次    | ✅ 快速生成<br>✅ 导演生成（完整版+分镜脚本） | ✅ 同模型 | ✅ 无限保存     | 🔵 尊贵Director徽章 | 快速通道 |       |

---

## 🧠 5. 使用定义（Usage Rules）

* **一次使用 = 一次生成 或 一次优化**。
* 无论自动匹配语言生成或指定语言生成，均计为 1 次。
* Free Plan 每日重置次数；Creator/Director 每月重置。
* 若次数耗尽，显示升级引导弹窗。

---

## ⚙️ 6. 功能逻辑（Feature Logic）

### 6.1. 模式逻辑

| 模式                     | Free | Creator | Director | 描述               |
| ---------------------- | ---- | ------- | -------- | ---------------- |
| 快速生成模式 (Quick Mode)    | ✅    | ✅       | ✅        | 即时生成优化Prompt     |
| 导演生成模式 (Director Mode) | ❌    | ✅       | ✅        | 生成完整分镜与脚本（多段落结构） |

---

### 6.2. 计次逻辑

```ts
// example pseudo-code
function handleGenerate(user, mode) {
  const cost = 1;
  if (user.remaining_credits < cost) {
    showUpgradeModal();
    return;
  }
  callAIPromptEngine(mode);
  user.remaining_credits -= cost;
  saveHistory(user, result);
}
```

* Free 每日重置 `daily_credits = 3`
* Creator 每月重置 `monthly_credits = 1000`
* Director 每月重置 `monthly_credits = 3000`

---

### 6.3. 历史记录逻辑

* 所有用户历史记录无限保存（按用户ID）
* 记录字段：`prompt_input`, `optimized_output`, `mode`, `timestamp`, `language`, `duration`
* 可分页加载与按日期筛选

---

### 6.4. Prompt优化逻辑

* 所有层级统一调用 `PromptEngine v2.0`（同一模型，如 GPT-5 / SoraPrompt Core）。
* 无分级差异。
* 逻辑：输入 → 优化 → 输出 → 脚本结构化 → 存档。

---

### 6.5. 身份徽章逻辑

| 层级       | 徽章样式                | 展示位置                    |
| -------- | ------------------- | ----------------------- |
| Free     | ⚪️ 灰白圆环「Free」       | 用户头像右上角                 |
| Creator  | 🟢 渐变绿色徽章「Creator」  | 用户头像右上角 + 生成结果页         |
| Director | 🔵 渐变蓝色徽章「Director」 | 用户头像右上角 + 结果页 + 排名页（预留） |

---

## 💬 7. 升级引导逻辑（Upgrade Flow）

| 触发场景           | 弹窗提示文案                                | CTA按钮                         |
| -------------- | ------------------------------------- | ----------------------------- |
| 次数耗尽           | “🎬 今日生成次数已用完，升级解锁更多创作空间！”            | [升级为 Creator]                 |
| 频繁生成           | “🔥 你的创作势头太棒了！Creator 每月可享 1000 次生成。” | [升级为 Creator]                 |
| 高级功能点击（Free用户） | “导演模式仅对订阅用户开放。”                       | [升级为 Creator] / [了解 Director] |

---

## 🧾 8. 数据结构建议（Database Schema）

**Table: `subscriptions`**

| 字段                | 类型                                | 描述     |
| ----------------- | --------------------------------- | ------ |
| user_id           | string                            | 用户唯一ID |
| tier              | enum("free","creator","director") | 当前订阅层级 |
| remaining_credits | int                               | 剩余次数   |
| reset_cycle       | enum("daily","monthly")           | 重置周期   |
| badge_type        | string                            | 徽章类型   |
| renewal_date      | datetime                          | 下次重置时间 |

**Table: `histories`**

| 字段               | 类型       | 描述               |
| ---------------- | -------- | ---------------- |
| id               | string   | 记录ID             |
| user_id          | string   | 用户ID             |
| mode             | string   | quick / director |
| prompt_input     | text     | 用户输入             |
| optimized_output | text     | AI优化后输出          |
| created_at       | datetime | 创建时间             |

---

## 🧩 9. 接口需求（API Integration）

| 功能     | 方法   | 路径                          | 描述          |
| ------ | ---- | --------------------------- | ----------- |
| 获取订阅信息 | GET  | `/api/subscription/:userId` | 返回当前层级与剩余次数 |
| 扣减次数   | POST | `/api/subscription/use`     | 调用后扣除 1 次   |
| 重置次数   | POST | `/api/subscription/reset`   | 每日/每月定时任务   |
| 升级计划   | POST | `/api/subscription/upgrade` | 修改层级并刷新额度   |
| 获取历史记录 | GET  | `/api/history/:userId`      | 获取用户生成历史    |
| 创建历史记录 | POST | `/api/history/create`       | 存储生成结果      |

---

## 🔔 10. 重置与计费周期

| 版本       | 重置周期            | 触发条件    |
| -------- | --------------- | ------- |
| Free     | 每日 UTC 00:00    | 自动恢复3次  |
| Creator  | 每月 1日 UTC 00:00 | 恢复1000次 |
| Director | 每月 1日 UTC 00:00 | 恢复3000次 |

---

## 🧩 11. UI显示要点（前端）

* **订阅卡片**：Free / Creator / Director 三栏横排对比。
* **剩余次数条**：顶部显示“已使用 X / 总次数”。
* **徽章显示**：在生成结果页面右上角。
* **升级按钮**：全局可见，状态随层级变化。
* **模式入口**：Free 仅显示「快速生成」；Creator/Director 显示「快速生成」「导演生成」。

---

## ✅ 12. 验收标准（Acceptance Criteria）

| 编号  | 验收项                     | 验收标准             |
| --- | ----------------------- | ---------------- |
| AC1 | 订阅层级切换正常                | 用户可自由升级、降级       |
| AC2 | 次数正确扣减                  | 每次生成调用后剩余次数减少    |
| AC3 | Free 每日自动重置             | 次数在UTC 00:00恢复至3 |
| AC4 | Creator/Director 每月自动重置 | 周期性更新额度          |
| AC5 | 所有层级调用相同Prompt优化引擎      | 输出质量一致           |
| AC6 | 历史记录保存无限                | 任意生成记录可长期查询      |
| AC7 | 徽章渲染正确                  | 根据层级展示对应颜色与文案    |
| AC8 | 升级弹窗正确触发                | 用尽次数时显示升级弹窗      |

---

## 🧩 13. 未来扩展（Future Scope）

* 支持团队计划（Team Plan）
* 支持积分商城（购买额外次数）
* 支持年度订阅与优惠券系统
