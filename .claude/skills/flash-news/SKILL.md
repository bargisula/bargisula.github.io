---
name: flash-news
description: >
  用於將使用者提供的財經新聞內容，補充相關背景後，以快訊格式寫入並推上 bargisula.github.io。
  觸發時機：使用者說「快訊」並附上新聞內容或連結。
---

# 快訊寫入技能

使用者給你一篇新聞（內容或截圖），你要補充相關背景，整理成快訊格式，寫入當月檔案，commit 並 push。

## 快訊格式規範

每則快訊由三個區塊組成，之間以 `---` 分隔：

```
### HH:MM｜MM/DD｜[情緒] [類別]｜[標題]

[第一段：核心事件或數據，1–2 句]

[第二段（選填）：背景、驅動因子或市場含意，1–2 句]

> #標籤1 #標籤2 #標籤3

---
```

### 情緒標注對照

| 符號 | 意義 |
|------|------|
| 🟢 | 看多 / 正面訊號 |
| 🔴 | 看空 / 負面訊號 |
| ⚠️ | 風險 / 警告 |
| 📌 | 重要事件（中性） |
| 💡 | 觀點 / 分析 |

### 類別選項

`AI`、`美股`、`台股`、`黃金`、`總經`、`央行`、`地緣`、`加密貨幣`、`金融代幣化`、`產業`

### 寫作原則

- 第一段講「發生什麼、數字是多少」
- 第二段講「為什麼重要、背景脈絡」
- 標題要簡短，含關鍵字或數字
- 標籤控制在 3–5 個
- 不加個人意見，只整理事實與觀點歸屬
- 時間使用新聞發佈時間（如無則用當下時間）

---

## 工作流程

### 1. 解析來源

從使用者訊息提取：
- 新聞標題、發佈時間、來源
- 核心數據、機構名稱、觀點立場
- 文章日期 → 決定寫入哪個月份檔案

月份檔案路徑：`src/content/notes/投資/快訊/YYYY-MM.mdx`

### 2. 補充相關資訊（WebSearch）

用 WebSearch 搜尋 1–2 個補充角度：
- 相關機構的歷史表態
- 關鍵數據的背景（如「央行購金量」對比歷史）
- 市場反應或分析師看法

搜尋結果用於豐富第二段背景，但不要讓快訊超過 4 句話。

### 3. 讀取目標檔案

用 Read 工具讀取月份檔案，確認現有條目時間順序，決定新條目的插入位置（依日期時間倒序排列，最新在最上方）。

### 4. 寫入快訊條目

用 Edit 工具，將新條目插入正確位置（在第一個 `###` 標題之前，或在比新條目更舊的條目之前）。

若目標月份檔案不存在，用 Write 工具建立，frontmatter 格式如下：

```mdx
---
title: '市場快訊｜YYYY 年 MM 月'
description: '台股、美股、黃金、總經 — YYYY 年 MM 月多空觀點與市場事件紀錄'
category: '投資'
subcategory: '快訊'
topic: '市場快訊'
pubDate: 'YYYY-MM-01'
---

import Callout from '../../../../components/Callout.astro';

> 隨手記錄多空觀點、市場事件、數據與個股動態。台股、美股、黃金、總經每則皆含情緒標注。

---

```

### 5. Commit & Push 到 feature branch

```bash
git add src/content/notes/投資/快訊/YYYY-MM.mdx
git commit -m "feat(快訊): 新增 MM/DD [類別]快訊 — [標題關鍵字]"
git push -u origin <current-branch>
```

Push 失敗時以指數退避重試最多 4 次（2s、4s、8s、16s）。

### 6. 建立 PR 並 Merge 進 main

`main` 有 branch protection，**不可直接 push**，須透過 GitHub MCP 建 PR 再 merge。

```
mcp__github__create_pull_request:
  owner: bargisula
  repo: bargisula.github.io
  title: feat(快訊): 新增 MM/DD [類別]快訊 — [標題關鍵字]
  head: <current-branch>
  base: main
  body: 一行說明新增哪幾則快訊

mcp__github__merge_pull_request:
  owner: bargisula
  repo: bargisula.github.io
  pullNumber: <PR number from above>
  merge_method: squash
```

Squash merge 後，遠端 `main` 會產生新的 commit hash，本地 `main` 與遠端會出現分叉。merge 完成後執行：

```bash
git fetch origin main
git reset --hard origin/main
```

---

## 完成後回報

告知使用者：
- 寫入的條目標題與時間
- 插入位置（在哪個條目之前/之後）
- PR 編號與 merge 結果

不需要顯示完整的快訊內容（使用者已知道），簡短確認即可。
