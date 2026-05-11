# Note for Claude

## 已有 repo，不需要重新建立

Skills 已經放進這個 repo：`bargisula/bargisula.github.io`

路徑：`.claude/skills/`

目前 repo 裡有：
- `flash-news` — 財經快訊自動寫入網站
- `menu` — 列出所有 skill 並讓使用者選擇

## 回答你的兩個問題

**問題 1：想把 `~/.claude/skills/` 的 skills 也備份到 GitHub**

→ 對，就是這樣做。把你本地 `~/.claude/skills/` 裡的每個 skill，複製一份到這個 repo 的 `.claude/skills/` 目錄下，commit 後 push 上去就完成備份與同步。

**問題 2：還是已經有個 repo，需要記下位置方便日後 pull 同步？**

→ 兩者都是。repo 已存在，位置是 `github.com/bargisula/bargisula.github.io`，請記下這個位置。之後有新 skill 就 push 到這裡，要同步就 pull。

## 你需要做的事

你本地有這些 skills（從畫面看到的）：

- `flash`
- `daily-report`
- `weapon-rc`（或類似名稱）
- `us-tech-analysis`
- `deep-analysis`
- `quick-scan`
- `us-weekly-report`
- `ai-infra-scan`

請把它們複製到 `.claude/skills/` 並 push 上去，這樣手機版和其他裝置也能用。

## 工作流程

新增或修改 skill → commit → push → 其他裝置 git pull → 立即可用

## 注意事項

- `main` branch 有 branch protection，**不能直接 push**
- 流程：建 feature branch → push → 開 PR → merge
- PR merge 後本地執行 `git fetch origin main && git reset --hard origin/main`
