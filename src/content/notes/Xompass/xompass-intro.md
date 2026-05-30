---
title: '【Xompass】AI 驅動的個人投資研究系統'
description: 'X（探索前沿）+ Compass（方向導航）。用 AI Agent 取代傳統投顧研究員 80% 的資料整理工作，從公開財報與法說會自動挖掘新聞還沒報、供應鏈已起漲的璞玉股。'
category: 'Xompass'
subcategory: '關於 Xompass'
pubDate: '2026-05-22'
---

## 是什麼

**X**（探索前沿）**+** **Compass**（方向導航）。

用 AI Agent 取代傳統投顧研究員 80% 的資料整理工作。從公開財報與法說會自動挖掘「新聞還沒報，供應鏈已起漲」的璞玉股。

核心邏輯：**產業觸發 → 供應鏈圖譜展開 → 替代技術掃描**。

---

## 組織架構

董事長下設 CEO，CEO 統籌四位高管平行運作：

| 高管 | 職責 |
|---|---|
| **CIO**（投資長）| 整合各 Agent 輸出，組成完整報告推上 GitHub |
| **CMO**（首席宏觀官）| Regime 判讀，維護景氣座標，每週更新 |
| **DNI**（情報長）| 即時新聞採集，清洗存入資料庫 |
| **CTO**（技術長）| 追蹤科技前沿，6–18 個月轉折點 |

**研究部**（由 CEO 調度或董事長直接呼叫）：

| 研究員 | 職責 |
|---|---|
| **ai-infra-researcher**（AI 基礎設施研究員）| 追蹤 NVDA / AMD / AVGO / QCOM，維護 Company Bible，產出開始覆蓋、財報筆記、論點更新 |
| **industry-analyst**（產業分析師）| 深度產業分析，七維度思考框架，Mordor Intelligence 資料搜尋，輸出遵循 v2.0 七模組 |
| **earnings-analyst**（財報分析師）| 解析個股財報，逐條對照論點條件，裁定論點成立 / 弱化 / 失效 |
| **Codex**（外勤分析師）| 透過 inbox 非同步觸發，獨立搜尋資料、撰寫產業分析，結果寫入 outbox 供 CEO 審閱；不佔用主對話 token |

**行政幕僚**：

| 幕僚 | 職責 |
|---|---|
| **secretary**（秘書）| 開會第一棒：報財報日 / FOMC / 重要數據行事曆；追蹤管理：寫入並回報 watchlist；開會後整理會議紀錄存檔 |

**資料採集層**（不分析、只提供數字，供各 agent 組合調用）：

| 採集員 | 職責 |
|---|---|
| **market-data**（市場數據採集員）| 輸入 market（US / TW）+ session（盤前 / 盤後），回傳結構化報價表格 |
| **news-scout**（新聞精選員）| 從 DNI 資料庫讀取當日新聞，依 topic 精選 2–3 則並附一句洞察；DNI 無資料才補 WebSearch |

---

## 產品線

| 產品 | 說明 |
|---|---|
| **璞玉報告** | 大事件觸發，從供應鏈知識庫找間接受益標的 |
| **璞玉週報** | 本週 Regime + 觸發事件 + 供應鏈受益標的彙整 |
| **月度備忘錄** | 宏觀敘事回顧 + 持倉論點現況 + 下月關注焦點 |
| **個股深度報告** | 完整五力分析，含論點與失效條件 |
| **財報筆記** | 數字解讀 + 論點是否仍成立 |
| **會議紀錄** | 每次晨會與臨時討論的洞察提煉與裁定記錄 |

---

## 研究框架

### 知識層次

```
資料 → 資訊（整理）→ 知識（關係）→ 智慧（推演）→ 裁定（行動）
```

AI Agent 負責資料與資訊層；CEO 負責知識與智慧層，主導推演與裁定。

### 當前 Regime

**AI\_capex\_cycle**：超大型雲端業者 AI 資本支出持續擴張，驅動半導體、光纖、電力基礎設施需求。聚焦：AI 基礎設施 / 光纖 / 電力。

### 供應鏈知識庫（璞玉計畫，10 家）

GLW、VRT、ANET、KLAC、LRCX、COHR、EQIX、APD、ETN、CIEN

---

## 知識庫（Knowledge Bible）

每次分析從**已知基準**出發，而非從零開始。知識庫存放跨對話的領域知識，存於 `data/knowledge/`，分三層：

### 三層架構

| 層級 | 路徑 | 內容 | 更新頻率 |
|---|---|---|---|
| **Mechanisms**（機制） | `mechanisms/` | 因果傳導鏈、歷史先例、可觀測觸發條件 | 事件驅動（每次危機） |
| **Structures**（結構） | `structures/` | 產業供應鏈地圖、競爭格局、定價機制 | 每半年至一年 |
| **Entities**（實體） | `entities/` | 公司與機構知識（擴展 company bible 概念） | 每季財報後 |

Company Bible（`data/coverage/ai-chips/`）由 ai-infra-researcher 獨立維護，覆蓋 NVDA / AMD / QCOM / AVGO，為 Entities 層的子集。

### 各層內容格式

每份機制知識包含：**觸發條件 → 傳導節點（含時間滯後與幅度估算）→ 可觀測早期指標 → 歷史先例 → 已知缺口**。每個節點記錄確信度與 `last_validated` 日期。

### 何時讀取

| Agent | 讀取時機 | 讀取內容 |
|---|---|---|
| **CMO** | Regime 評估 Step 0 | `mechanisms/` 相關傳導鏈 |
| **CEO** | 會議推演鏈前 | `mechanisms/` + `structures/` |
| **industry-analyst** | 開始產業分析前 | `structures/` 對應產業 |
| **earnings-analyst** | 財報解析前 | `entities/[TICKER].json` |
| **ai-infra-researcher** | 固定 Step 0 | `data/coverage/ai-chips/[TICKER].json` |

### 如何累積

- **會議沉澱**：每次晨會或緊急討論產生新機制知識，CEO 在寫會議紀錄後同步更新 `mechanisms/`
- **財報後更新**：earnings-analyst 或 ai-infra-researcher 更新 `entities/`
- **產業分析後**：industry-analyst 輸出存入 `structures/`

知識不強求完整，**遇到什麼填什麼**，一年後自然形成厚實的研究底座。

---

## 日常運作

| 頻率 | 動作 |
|---|---|
| 每日 | `/meeting` 晨會：Secretary + DNI 並行，CEO 洞察提煉與推演 |
| 事件觸發 | `/jade-report [事件]`：璞玉供應鏈分析 |
| 每週五 | CMO 更新 Regime Config |
| 每月 | `/monthly-memo` 月度備忘錄 |
