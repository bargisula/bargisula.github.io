# 系統設計總覽

> 本文件記錄 bargisula.github.io 的 AI agent 系統架構設計，供 CEO agent 稽核與董事長參考。
> 最後更新：2026-05-19
>
> ⚠️ **快照警告：本文件為人工維護，已知落後於實際系統。唯一真相 = `.claude/` 下的檔案。**
> Agent 無中央註冊檔，靠各檔 `name:` 自我註冊（清單：`grep "^name:" .claude/agents/*.md`）；
> 流程看 `.claude/commands/*.md`；即時系統地圖跑 `/ceo system`。
> **注意命名：** 下表「首席經濟學家」對應的實際 agent 檔是 `cmo.md`（`name: cmo`），
> 系統中**不存在** `chief-economist` 這個 agent，調度一律用 `cmo`。

---

## 組織架構

```
董事長
│
├── CEO（會議主席 + 系統診斷）
│   ├── 晨會主持：秘書 → 情報長 → 自由問答調度
│   ├── 週報主持：秘書 → 情報長 → 覆蓋股檢視
│   └── 系統診斷：audit / strategy / system / memory / token
│
├── 秘書（開會第一棒：行事曆簡報）
│
├── 情報長（開會第二棒：新聞情報）
│   └── Python pipeline：RSS → SQLite → JSON → 摘要
│
├── 投資線
│   ├── CIO（整合投資報告）
│   │   ├── market-data（數據採集）
│   │   ├── news-scout（暫停，由情報長取代）
│   │   ├── macro-scan-auto（週日總經掃描）
│   │   └── us-pre / us-post / tw-pre / tw-post（盤前後報告）
│   ├── 財報分析師（個股財報深度解析）
│   ├── 首席經濟學家（regime 判讀，待建）
│   ├── CTO（科技前沿，待建）
│   └── 研究部（待建）
│
└── 績效管理委員會（CEO 主持，每月）
    ├── 現況分析：持倉截圖 → 三視角 → 分歧呈選項
    └── 案例分析：已實現操盤 → 解構 → 存案例庫
```

---

## 會議系統

### 觸發詞與流程

| 觸發詞 | 指令 | 流程 |
|---|---|---|
| 「開會了」 | `/meeting` | 秘書 → 情報長（即時跑）→ CEO 主持自由問答 |
| 「開週報會議」 | `/weekly` | 秘書 → 情報長（近7天）→ 覆蓋股檢視 |
| 「開績效管理委員會」 | `/pmc` | CEO 調度 PMC agent，多角度分析操盤 |

### 自由問答調度規則

董事長在會議中說任何話，CEO 判斷並調度：

| 問題類型 | 調度 agent |
|---|---|
| 大盤走勢、市場情緒 | macro-scan-auto |
| 特定個股（為什麼漲跌） | earnings-analyst + industry-analyst |
| 產業趨勢 | industry-analyst |
| 財報細節 | earnings-analyst |
| 新聞背景 | 讀 data/intel/ JSON |
| 宏觀數據 | macro-scan-auto |

### 分歧處理

有分歧時 CEO 不裁定，呈兩選項（各附前提條件與風險）→ 董事長裁定。

---

## 角色清單

### 已建立

| 角色 | 類型 | 功能 | 觸發 |
|---|---|---|---|
| CEO | Agent | 會議主席 + 系統診斷 | `/ceo` / 會議中 |
| 秘書 | Agent | 行事曆簡報（財報/FOMC/數據）| 開會流程 |
| 情報長 | Agent + Python | 新聞抓取/清洗/存檔/摘要 | 開會流程 |
| 財報分析師 | Agent | 個股財報深度解析 | CEO 調度 或 直接叫 |
| PMC | Agent | 績效管理委員會（兩模式）| `/pmc` |
| 首席經濟學家 | Agent | Dalio 三層 Regime 判讀（接 US-STOCK API）| CEO 調度/直接叫 |
| CTO | Agent | 科技前沿，識別未定價技術變化 | CEO 調度/月度觸發 |
| AI基礎設施研究員 | Agent | 追蹤 NVDA/AMD/AVGO/QCOM，維護 company bible | CEO 調度/直接叫 |
| CIO | Agent | 整合投資報告 | 排程/手動 |
| market-data | Agent | 數字採集，只回表格 | CIO 呼叫 |
| industry-analyst | Agent | 產業深度分析，產 MDX 報告 | CEO 調度/手動 |
| us-pre / us-post | Agent | 美股盤前後報告 | 自動排程 |
| tw-pre / tw-post | Agent | 台股盤前後報告 | 自動排程 |
| macro-scan-auto | Agent | 週日 10:20 自動總經掃描 | 排程/CEO 調度 |
| /stock-scan | Skill | 個股快速五維掃描 | on-demand |
| /flash | Skill | 隨手記錄市場快訊 | on-demand |
| /flashlog | Skill | 查閱本月快訊 | on-demand |

### 待建立

| 角色 | 類型 | 功能 | 優先度 |
|---|---|---|---|
| 科技平台研究員 | Agent | 追蹤 AAPL/MSFT/GOOGL/META | 中 |
| 電動車研究員 | Agent | 追蹤 TSLA | 低 |

---

## 情報長 Pipeline

```
RSS Feeds（12 個來源，4 類別）
    ↓
intel_fetch.py 抓取 + 清洗 + 去重
    ↓
data/intel/news.db（SQLite，歷史查詢）
data/intel/YYYY-MM-DD.json（每日，agents 讀）
    ↓
dni agent 整理摘要 → 呈報董事長
```

**其他 agent 用法：**
- 今日新聞：`cat data/intel/YYYY-MM-DD.json`
- 歷史查詢：`python .claude/scripts/intel_query.py --keyword "Fed" --days 7`
- **news-scout 暫停**，全部由情報長負責

**來源清單（初版）：**
| 類別 | 來源 |
|---|---|
| 財經 | Reuters Business, FT, Bloomberg, Yahoo Finance |
| 科技 | TechCrunch, The Verge, Ars Technica |
| 地緣政治 | Reuters World, Foreign Policy, AP World |
| 軍事 | Defense News, War on the Rocks, Breaking Defense |

---

## 績效管理委員會（PMC）

| 模式 | 輸入 | 輸出 | 存檔 |
|---|---|---|---|
| 現況分析 | 持倉截圖 | 三視角分析 + 分歧選項 | `data/pmc/YYYY-MM-現況.md` |
| 案例分析 | 已實現操盤記錄 | 決策解構 + 可操作學習 | `data/pmc/cases/YYYY-MM-TICKER.md` |

---

## 每日運行模式

| 時間 | 角色 | 動作 |
|---|---|---|
| 06:00 | us-post | 美股盤後報告 |
| 08:30 | tw-pre | 台股盤前報告 |
| 13:35 | tw-post | 台股盤後報告 |
| 21:30 | us-pre | 美股盤前報告 |
| 開會時 | 情報長 | 即時抓取新聞（不預先排程）|
| 隨時 | /flash | 市場快訊記錄 |

## 每週運行模式

| 時機 | 角色 | 動作 |
|---|---|---|
| 週一 | /weekly | 週報會議（秘書 + 情報長 + 覆蓋股）|
| 週中 | 首席經濟學家（待建）| Regime 判讀 |
| 週日 10:20 | macro-scan-auto | 總經週掃描 |

## 每月運行模式

| 時機 | 角色 | 動作 |
|---|---|---|
| 月初 | /ceo audit | 文章品質稽核 |
| 月中 | CTO（待建）| 科技前沿簡報 |
| 月底 | /pmc | 績效管理委員會 |
| 月底 | /ceo strategy | 系統策略建議 |

---

## 設計決策記錄

| 決定 | 原因 |
|---|---|
| news-scout 暫停 | 情報長統一負責新聞，避免重複建設 |
| 情報長開會時即時跑 | 確保新聞是當天最新的，不用預排程 |
| CEO 不裁定只呈選項 | 投資決策最終由董事長負責，CEO 呈利弊由人裁定 |
| PMC 持倉用截圖輸入 | 最低摩擦力，不需要維護額外的 JSON 持倉檔 |
| 案例分析存成案例庫 | 累積操盤知識，供未來 CEO 系統診斷時參考 |
| Quant Analyst 不建 | usstock 已涵蓋計算，首席經濟學家負責解讀 |
| 地緣政治分析師不建 | 情報長 + 開會討論已覆蓋，不值得獨立角色 |
