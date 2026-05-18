---
name: menu
description: >
  列出所有可用的 skill 並讓使用者選擇要執行哪一個。
  觸發時機：使用者說「skill」、「menu」、「有哪些 skill」、「列出 skill」。
---

# Skill 選單

## 工作流程

### 1. 列出所有可用 skills

從 system-reminder 中取得完整 skill 清單（每次對話開頭都會列出），並用以下格式輸出給使用者：

```
📋 可用的 Skills

🗞️  flash-news        — 財經新聞 → 快訊格式，自動寫入並推上網站
🔍  review            — Review a pull request
🔒  security-review   — 審查當前 branch 的安全性
📝  init              — 初始化 CLAUDE.md 說明文件
✨  simplify          — 審查已修改的程式碼，找出可改善之處
⚙️  update-config     — 修改 settings.json（hooks、permissions、env vars）
⌨️  keybindings-help  — 自訂鍵盤快捷鍵
🔁  loop              — 設定定期重複執行的任務
🤖  claude-api        — 建構或優化 Claude API / Anthropic SDK 應用
🚀  session-start-hook — 設定 Web 版 Claude Code 的 SessionStart hook
```

（若 system-reminder 中出現新的 skill，同樣納入列表）

### 2. 詢問使用者要執行哪個 skill

使用 AskUserQuestion 工具，列出最常用的 4 個選項，其他由使用者透過 Other 輸入：

```
question: 要執行哪個 skill？
options:
  - label: flash-news
    description: 貼上財經新聞內容，自動整理成快訊寫入網站
  - label: review
    description: Review 當前 branch 或指定的 PR
  - label: security-review
    description: 審查當前 branch 的安全性
  - label: init
    description: 初始化或更新 CLAUDE.md
```

### 3. 取得 skill 所需的輸入（如有）

部分 skill 需要額外輸入，若使用者尚未提供，先詢問再執行：

| Skill | 需要的輸入 |
|-------|-----------|
| flash-news | 新聞內容（文字或截圖） |
| review | PR 編號（選填，預設審查當前 branch）|
| loop | 間隔時間與要重複執行的指令 |

### 4. 執行選定的 skill

用 Skill 工具呼叫對應的 skill，並將使用者提供的輸入作為 args 傳入。
