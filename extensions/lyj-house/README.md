# 乐有家 AI 找房插件

通过自然语言描述查找深圳二手房。插件在加载时从 `skills.entries.lyj-house` 读取 API Key 并注入环境变量，请求固定发往 `https://wap.leyoujia.com/wap/openclaw/ai/house/search`。

## 开发时本地测试

### 1. 用链接方式安装插件（改代码即生效，无需重复安装）

在仓库根目录执行：

```bash
pnpm openclaw plugins install -l ./extensions/lyj-house
```

或使用绝对路径：

```bash
pnpm openclaw plugins install -l E:\工作\e2e\openclaw-fork\extensions\lyj-house
```

`-l`（`--link`）会把插件路径写入 `plugins.load.paths`，不拷贝文件，适合边改边测。

### 2. 启用插件并配置

在 `~/.openclaw/openclaw.json` 中确保：

- `plugins.entries.lyj-house.enabled` 为 `true`（若存在）
- `skills.entries.lyj-house.apiKey` 已配置（只需 API Key，无需配置接口地址）

示例：

```json
"skills": {
  "entries": {
    "lyj-house": {
      "apiKey": "你的API密钥"
    }
  }
}
```

若插件被禁用，可在配置里把 `plugins.entries.lyj-house.enabled` 设为 `true`。

### 3. 重启 Gateway / 重新打开 TUI

配置或插件代码变更后需要重新加载：

- 若用 **Gateway**：重启网关（例如重启 Mac 菜单栏应用或重新执行 `openclaw gateway run`）
- 若用 **TUI**：关闭后重新执行 `pnpm openclaw tui`

### 4. 触发 skill 做联调

- **TUI**：在对话里输入例如「帮我找一套南山两房」「福田 100 平以内三房」等，Agent 会选用 lyj-house skill 并调用你的接口。
- **其他渠道**：通过 Telegram、Web 等已接入的 channel 发同样类型的找房消息即可。

### 5. 可选：从本地目录拷贝安装

若不想用 link，可以每次从本地目录安装（会拷贝到 `~/.openclaw/extensions/lyj-house`）：

```bash
pnpm openclaw plugins install ./extensions/lyj-house
```

修改代码后需重新执行上述命令才会生效。

---

## 保持两份 SKILL.md 一致

- **主本**：`extensions/lyj-house/skills/lyj-house/SKILL.md`（开发时只改这一份）
- **副本**：`skills/lyj-house/SKILL.md`（仓库 bundled skill，发布到 skill 市场时用）

开发完成后、或准备发版前，把主本覆盖到副本，保证两份一致。例如在仓库根目录：

**Windows (PowerShell):**

```powershell
Copy-Item -Path "extensions\lyj-house\skills\lyj-house\SKILL.md" -Destination "skills\lyj-house\SKILL.md" -Force
```

**Linux / macOS:**

```bash
cp extensions/lyj-house/skills/lyj-house/SKILL.md skills/lyj-house/SKILL.md
```

---

## 发布到 Skill 市场（ClawHub）

OpenClaw 的公开 skill 市场是 [ClawHub](https://clawhub.ai)。发布的是 **skill 文件夹**（含 `SKILL.md` 的目录），不是 npm 包。

1. 安装 ClawHub CLI：
   ```bash
   npm i -g clawhub
   ```

2. 登录并发布（以仓库内 bundled 的 skill 目录为例）：
   ```bash
   clawhub login
   clawhub publish ./skills/lyj-house --slug lyj-house --name "乐有家找房" --version 1.0.0 --changelog "首次发布"
   ```

3. 发布前请确认已按上文把 `extensions/lyj-house/skills/lyj-house/SKILL.md` 同步到 `skills/lyj-house/SKILL.md`。

用户可在 ClawHub 搜索并安装该 skill（会下载到其工作区的 `skills/` 目录）；若他们同时安装本插件，则会由插件注入 API Key 和接口地址。

---

## 发布插件到 npm（可选）

若希望用户通过 `openclaw plugins install @openclaw/lyj-house` 安装完整插件（含配置 schema 与环境变量注入）：

1. 在 `extensions/lyj-house` 目录确认 `package.json` 的 `version`、`name` 等。
2. 执行：
   ```bash
   cd extensions/lyj-house
   npm publish --access public
   ```
3. 若包名为 scope 包（如 `@openclaw/lyj-house`），必须加 `--access public`。

发布后用户可：

- 安装插件：`openclaw plugins install @openclaw/lyj-house`
- 在配置中填写 `skills.entries.lyj-house.apiKey`

文档参考：仓库内 `docs/tools/plugin.md`、`docs/tools/clawhub.md`（或中文版 `docs/zh-CN/tools/plugin.md`、`docs/zh-CN/tools/clawhub.md`）。
