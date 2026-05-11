@AGENTS.md

# Paper Boyfriend — 项目说明书

## 项目简介

**Paper Boyfriend（纸上男友）** 是一款面向中文用户的 AI 陪伴型 Web 应用。用户用 Google 账号登录后，从四个固定角色中选择一位"男友"进行聊天。每个角色有独立的人格、语气和状态线，AI 能回复文字、发送自拍图片、发送语音消息。应用还会自动从对话中提取用户记忆，使角色在后续对话中更了解用户。

面向女性用户，核心情感价值：陪伴感、被理解感。

---

## 四个角色

| ID | 姓名 | 定位 |
|---|---|---|
| `shen_xingzhou` | 沈行舟 | 学代码的焦虑男生，嘴硬心软 |
| `gu_chengye` | 顾承野 | 精致事业型男友，嘴甜自信 |
| `lin_ting` | 林听 | 温柔倾听文艺型，善于共情 |
| `zhou_yan` | 周砚 | 成熟稳定建筑师，安全感锚点 |

角色数据定义在 [`src/lib/boyfriends.ts`](src/lib/boyfriends.ts)，是项目的核心配置，修改须谨慎。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16.2.6（App Router） |
| 语言 | TypeScript 5 |
| UI | Tailwind CSS v4（PostCSS 插件模式） |
| 认证 | next-auth v5 beta（Google OAuth） |
| 数据库 | PostgreSQL（`pg`，自定义迁移脚本） |
| 文件存储 | Cloudflare R2（AWS S3 兼容，`@aws-sdk/client-s3`） |
| AI 文字 | DeepSeek（`src/lib/ai/deepseek.ts`） |
| AI 语音 | MiniMax TTS（`src/lib/ai/minimax.ts`） |
| AI 图像 | Seedream（`src/lib/ai/seedream.ts`） |
| 邮件 | Resend（注册时发欢迎邮件） |
| 客服聊天 | Crisp Chat（嵌入 layout） |
| 防机器人 | Cloudflare Turnstile（`@marsidev/react-turnstile`） |
| 测试 | Vitest |

> **注意**：Next.js 16 有破坏性变更，改代码前先查 `node_modules/next/dist/docs/` 中对应指南。

---

## 核心目录结构

```
src/
├── app/
│   ├── page.tsx                    # 首页（登录/落地页）
│   ├── home/page.tsx               # 角色选择页（登录后）
│   ├── chat/[boyfriendId]/page.tsx # 聊天页（核心产品路径）
│   ├── api/
│   │   ├── chat/route.ts           # ⚡ 聊天主接口（文字+图片+语音）
│   │   ├── images/route.ts         # 图片生成接口
│   │   ├── memories/route.ts       # 用户记忆接口
│   │   └── cron/love-letter/       # 定时任务（情书邮件）
│   ├── about/ blog/ pricing/       # 落地页辅助页面
│   ├── layout.tsx                  # 根布局（含 CrispChat）
│   ├── not-found.tsx / error.tsx   # 错误页
│   └── globals.css                 # Tailwind 全局样式入口
├── components/
│   ├── chat-panel.tsx              # 聊天面板主组件
│   ├── navbar.tsx                  # 全局导航（居中 Logo 方案B）
│   ├── navbar-mobile-menu.tsx      # 手机端折叠菜单
│   ├── auth-buttons.tsx            # 登录/登出控件
│   ├── leave-feedback-modal.tsx    # 离开反馈弹窗
│   └── crisp-chat.tsx              # Crisp 客服嵌入
└── lib/
    ├── boyfriends.ts               # 角色数据（核心配置）
    ├── auth.ts / auth-env.ts       # 认证入口和环境变量守卫
    ├── email.ts / r2.ts            # 邮件和 R2 工具
    ├── ai/
    │   ├── deepseek.ts             # 文字回复（主 LLM）
    │   ├── minimax.ts              # 语音合成
    │   ├── seedream.ts             # 自拍图片生成
    │   └── memory-extractor.ts     # 从对话提取用户记忆
    ├── auth/
    │   ├── google-provider.ts      # Google OAuth 配置
    │   └── turnstile.ts            # Turnstile 验证工具
    ├── chat/
    │   ├── messages.ts             # 消息类型转换工具
    │   ├── selfie-intent.ts        # 检测用户是否在请求自拍
    │   └── voice-intent.ts         # 检测用户是否在请求语音
    ├── db/
    │   ├── pool.ts                 # PostgreSQL 连接池（懒初始化）
    │   ├── messages.ts             # 消息持久化
    │   ├── user-memories.ts        # 用户记忆持久化
    │   └── migrations/             # SQL 迁移文件（按顺序执行）
    └── prompts/
        ├── characters.ts           # 各角色系统 prompt
        └── shared/                 # 通用 prompt 片段（自拍/语音/表情）
```

---

## 常用命令

```bash
npm run dev          # 启动开发服务器（localhost:3000）
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
npm run test         # Vitest 单元测试（run 模式，不 watch）
npm run db:migrate   # 执行数据库迁移（scripts/run-migrations.mjs）
```

---

## 环境变量（待确认完整列表）

项目运行需要以下环境变量（参考 `.env.example`，若不存在则待确认）：

| 变量 | 用途 |
|---|---|
| `DATABASE_URL` | PostgreSQL 连接字符串（带 `sslmode=require` 时自动启用 SSL） |
| `NEXTAUTH_SECRET` | next-auth 签名密钥 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `DEEPSEEK_API_KEY` | 文字 AI |
| `MINIMAX_*` | 语音合成（待确认具体变量名） |
| `SEEDREAM_*` | 图像生成（待确认具体变量名） |
| `R2_*` | Cloudflare R2 存储（待确认） |
| `RESEND_API_KEY` | 邮件发送 |
| `CRISP_WEBSITE_ID` | Crisp 客服 |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile |

> `DATABASE_URL` 缺失时 `getPool()` 返回 `undefined`，数据库功能静默降级，不会崩溃。认证相关变量缺失时 `auth-env.ts` 有保护。

---

## 开发规范

### 改代码前先读

1. **改角色相关**：先读 `src/lib/boyfriends.ts` 和 `src/lib/prompts/characters.ts`
2. **改聊天流程**：先读 `src/app/api/chat/route.ts`（这是最复杂的接口）
3. **改认证**：先读 `src/auth.ts` 和 `src/lib/auth-env.ts`
4. **改数据库**：先读现有迁移文件，新 schema 必须写新迁移文件，不要改旧文件
5. **改 Next.js API**：先查 `node_modules/next/dist/docs/` 中相关文档

### 谨慎操作区域

- `src/lib/boyfriends.ts`：角色 ID 是外键，改动会影响数据库数据和 URL 路由
- `src/lib/db/migrations/`：迁移文件只增不改，已执行的不能回退
- `src/app/api/chat/route.ts`：并发 Promise.allSettled 逻辑，改动需完整理解现有流程
- `src/lib/prompts/characters.ts`：系统 prompt 影响角色人格，修改前要了解当前 prompt 结构

### 编码规范

- 使用 TypeScript，不用 `any`，接口类型显式声明
- 组件文件用 `.tsx`，工具函数用 `.ts`
- 服务端代码（API routes、Server Components）中用 `await auth()` 鉴权
- 数据库操作用 `getPool()`，记得处理返回 `undefined` 的情况
- 错误处理：对外 API 用 `NextResponse.json({ error }, { status })`；内部工具函数 throw 或返回 undefined
- 不要写无意义注释，代码自描述优先

---

## 输出风格要求

在这个项目里回答问题和改代码时，Claude 应遵守：

1. **语言**：始终用中文回复（代码中的变量名、注释风格遵循已有代码）
2. **简洁**：不要重复解释已改动的内容，直接给出结果或变更说明
3. **不编造**：对不确定的环境变量名、API 字段名，标注"待确认"，不猜测
4. **不过度抽象**：不要为了"复用"把简单代码拆成多层，三行重复好过提前抽象
5. **不加多余注释**：只在"为什么这样做"不显而易见时加注释，不写"// 登录用户"这种废话
6. **改完说位置**：改了文件后告知文件路径和行号，方便跳转确认
7. **测试意识**：`src/lib/` 下的纯函数都有对应 `.test.ts`，改了逻辑记得同步更新测试

---

## 已知设计决策

- 导航栏采用**方案B（居中 Logo）**，不要改回左对齐方案
- 认证**仅支持 Google OAuth**，不做 Apple 登录或密码登录
- 角色数量固定为 4 个，角色配置是静态的（`as const`），未来扩展需讨论
- 用户记忆系统是自研的（非向量数据库），基于 PostgreSQL `user_memories` 表
- 图片生成用 Seedream，结果上传到 R2 后返回永久 URL，不返回 base64
