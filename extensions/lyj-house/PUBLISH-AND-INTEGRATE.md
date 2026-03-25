# 乐有家找房：发布到市场与官网集成说明

本文档包含：**一、上传到各市场的方式**；**二、官网可引用的「集成与使用」说明**（可直接放到乐有家官网）。

---

## 一、上传到主流市场的方式

乐有家找房包含两部分，发布方式不同：

| 类型 | 说明 | 发布入口 |
|------|------|----------|
| **Skill（技能）** | 仅含 `SKILL.md` 的文件夹，供 OpenClaw Agent 调用找房能力 | ClawHub（OpenClaw 官方技能市场） |
| **Plugin（插件）** | 含配置项、API Key 注入等，用户安装后自动配置环境变量 | npm（可选，与 ClawHub 互补） |

### 1. ClawHub（OpenClaw 技能市场，推荐）

- **站点**：https://clawhub.ai（或 https://clawhub.com）
- **发布对象**：skill 文件夹（含 `SKILL.md` 的目录），例如仓库中的 `skills/lyj-house`。

**步骤：**

1. 确保已把 `extensions/lyj-house/skills/lyj-house/SKILL.md` 同步到 `skills/lyj-house/SKILL.md`。
2. 安装 ClawHub CLI：
   ```bash
   npm i -g clawhub
   ```
   或：`pnpm add -g clawhub`
3. 登录（需 GitHub 账号，且账号至少注册满一周）：
   ```bash
   clawhub login
   ```
4. 发布技能（在仓库根目录执行）：
   ```bash
   clawhub publish ./skills/lyj-house --slug lyj-house --name "乐有家找房" --version 1.0.0 --changelog "支持深圳二手房与租房" --tags latest
   ```
5. 后续更新版本时，可改用 `--version 1.1.0` 并写清 `--changelog`，或使用：
   ```bash
   clawhub sync --root ./skills --all --bump patch --changelog "更新说明"
   ```

用户可在 ClawHub 搜索「乐有家找房」或 `lyj-house`，通过 `clawhub install lyj-house` 安装到本地。

### 2. npm（插件包，可选）

若希望用户通过一条命令安装「插件 + 配置项」，可把插件发布到 npm。

- **发布对象**：`extensions/lyj-house` 整个包（含 `openclaw.plugin.json`、`index.ts`、`skills/` 等）。
- **包名示例**：`@openclaw/lyj-house` 或 `openclaw-lyj-house`（scope 包需 `--access public`）。

**步骤：**

1. 在 `extensions/lyj-house` 下确认 `package.json` 的 `name`、`version`、`description`。
2. 登录 npm 并发布：
   ```bash
   cd extensions/lyj-house
   npm login
   npm publish --access public
   ```

用户安装方式：`openclaw plugins install @openclaw/lyj-house`（或你发布的包名）。

### 3. 其他说明

- **仅 ClawHub**：只发布 skill 时，用户需自行把技能目录放到工作区 `skills/lyj-house/`，并在配置里填写 `skills.entries.lyj-house.apiKey`；若同时安装了你发布的**插件**，则插件会注入 `LYJ_API_KEY`、`LYJ_API_URL`，无需再改环境变量。
- **ClawHub + npm**：用户可先在 ClawHub 安装技能 `lyj-house`，再 `openclaw plugins install @openclaw/lyj-house` 并配置 API Key，体验最完整。

---

## 二、官网集成说明（可直接放到乐有家官网）

以下内容可直接或稍作修改后放在乐有家官网的「OpenClaw 集成」或「智能体找房」说明页。

---

### 乐有家找房 · OpenClaw 集成指南

乐有家找房技能已上架 **OpenClaw 技能市场（ClawHub）**，支持在 OpenClaw 智能体里用自然语言查**深圳二手房**和**深圳租房**。

#### 前置条件

- 已安装 [OpenClaw](https://docs.openclaw.ai)（CLI 或带 Gateway 的客户端）。
- 已拥有乐有家找房 API Key（在 [深圳乐有家](https://shenzhen.leyoujia.com) 登录后，点击「申请OpenClaw密钥」获取）。

---

#### 方式一：从 ClawHub 安装技能（推荐）

1. 安装 ClawHub CLI：
   ```bash
   npm i -g clawhub
   ```
2. 安装「乐有家找房」技能：
   ```bash
   clawhub install lyj-house
   ```
3. 配置 API Key：编辑 OpenClaw 配置文件（一般为 `~/.openclaw/openclaw.json`），在 `skills.entries.lyj-house` 下填写 `apiKey` 即可（无需配置接口地址，请求固定发往 https://wap.leyoujia.com/wap/openclaw/ai/house/search）：
   ```json
   {
     "skills": {
       "entries": {
         "lyj-house": {
           "apiKey": "您在乐有家申请的API密钥"
         }
       }
     }
   }
   ```
4. 若使用 Gateway（如 Mac 菜单栏或 Web）：重启 Gateway 或重新打开会话，使配置生效。

---

#### 方式二：安装乐有家找房插件（可选，自动注入配置）

若技能已通过 npm 发布为插件，用户可安装插件后再配置 API Key，由插件自动注入环境变量：

1. 安装插件：
   ```bash
   openclaw plugins install @openclaw/lyj-house
   ```
2. 在 OpenClaw 配置中填写 `skills.entries.lyj-house.apiKey`（同上）。
3. 重启 Gateway 或重新打开会话。

---

#### 使用方式

在已启用该技能/插件的 OpenClaw 对话中，直接说出找房或租房需求即可，例如：

- **二手房**：「帮我找一套南山两房」「福田 100 平以内三房，总价 600 万」
- **租房**：「南山两房月租 5000 以内」「后海附近租房」

智能体会自动调用乐有家找房接口并返回房源列表与推荐。当前仅支持**深圳**区域。

---

#### 接口与密钥说明

- 找房接口由乐有家提供，请求需携带 API Key（通过 OpenClaw 配置中的 `skills.entries.lyj-house.apiKey` 传入）。
- 密钥申请与使用条款以乐有家官网为准；如有疑问，请咨询乐有家客服或开放平台支持。

---

#### 相关链接

- OpenClaw 文档：https://docs.openclaw.ai  
- ClawHub 技能市场：https://clawhub.ai  
- 乐有家深圳站（申请 API Key）：https://shenzhen.leyoujia.com  

---

以上「二、官网集成说明」可直接复制到官网；若你们有单独的「开发者/开放平台」页面，也可只保留「方式一 + 使用方式 + 相关链接」，并注明「如需一键配置可安装乐有家找房插件（见 ClawHub 或 npm）」。
