# Xompass 指揮中心

**X（探索前沿）+ Compass（方向導航）**

用 AI Agent 取代傳統投顧研究員 80% 的資料整理工作。從公開財報與法說會自動挖掘「新聞還沒報，供應鏈已起漲」的璞玉股。核心邏輯：產業觸發 → 供應鏈圖譜展開 → 替代技術掃描。

---

## 組織架構

```
              董事會
                │
              董事長
                │
               CEO
        ┌───────┼────────┬────────┐
       CIO     CMO     DNI      CTO
        │                │
      研究部            情報組
      ├ AI基礎設施研究員  ├ 市場數據員
      ├ 產業分析師        └ 新聞精選員
      └ 財報分析師

CEO 直屬幕僚：秘書（Secretary）
```

---

## 角色職掌

### 高管層（C-suite）

| 角色 | 全名 | 核心職責 |
|---|---|---|
| **CEO** | 執行長 | 主持晨會與臨時會議、系統診斷、協調各部門；知識層與智慧層由 CEO 親自主導，不外包 |
| **CIO** | 投資長 | 整合研究部各 Agent 輸出，組成完整報告並推 GitHub；璞玉報告、個股推薦的最終發布者 |
| **CMO** | 首席宏觀官 | Regime 判讀與景氣座標定位，每週五更新 Regime Config；整合 Dalio 三層框架、市場 Regime、危機雷達 |
| **DNI** | 情報長 | 即時抓取財經/科技/地緣政治/軍事四類新聞，清洗後存入 SQLite；其他 Agent 讀 `data/intel/` 取用 |
| **CTO** | 技術長 | 追蹤科技前沿 6–18 個月轉折點，識別「論文→產品→定價」之間的時間差；不做個股分析 |

### CEO 直屬幕僚

| 角色 | 全名 | 核心職責 |
|---|---|---|
| **Secretary** | 秘書 | 三項職責：(1) 開會前報告行事曆（財報日、FOMC、重要數據）；(2) 維護 Watchlist，每次開會追蹤到期事項；(3) 開會後整理會議紀錄存 `data/meetings/` 並推部落格 |

### 研究部（CIO 轄下）

| 角色 | 全名 | 核心職責 |
|---|---|---|
| **ai-infra-researcher** | AI 基礎設施研究員 | 深度覆蓋 NVDA / AMD / AVGO / QCOM，維護 company bible JSON；建立供應鏈圖譜，產出開始覆蓋、財報筆記、論點更新三種研究報告 |
| **industry-analyst** | 產業分析師 | 輸入產業名稱或主題，自動判斷框架，獨立搜尋數據，產出完整 MDX 產業分析報告；回答「為什麼現在、為什麼是它、什麼會讓邏輯失效」 |
| **earnings-analyst** | 財報分析師 | 抓取 SEC EDGAR 原始申報，逐項解析財報數字，對照投資論點，給出論點是否仍成立的裁定 |

### 情報組（DNI 轄下）

| 角色 | 全名 | 核心職責 |
|---|---|---|
| **market-data** | 市場數據員 | 輸入市場（US/TW）與盤別（盤前/盤後），回傳結構化數字表格；只提供數字，不分析、不評論 |
| **news-scout** | 新聞精選員 | 從 DNI 資料庫讀取當日新聞，精選 2–3 則並附投資相關性洞察；優先讀快取，無快取才 WebSearch 補充 |

---

## 產品線

| 產品 | 頻率 | 指令 | 說明 |
|---|---|---|---|
| 璞玉報告 | 每週 | `/jade-weekly` | 主動選 2-3 個產業深度分析，供應鏈受益標的 |
| 總經報告 | 每週 | `/macro-weekly` | CMO 敘事驅動週報，一個核心張力，500-700字 |
| 個股推薦 | 每週 | `/stock-pick [TICKER]` | 論點優先，基本面+催化劑+失效條件三位一體 |
| 績效檢討 | 每月 | `/pmc` | 持倉現況分析或已實現操盤案例萃取 |
| 晨會記錄 | 每日 | `/meeting` + Secretary | 洞察提煉、推演鏈、裁定，自動推部落格 |
| 臨時會議紀錄 | 隨時 | `/discuss [主題]` | 針對特定問題，跳過新聞採集直接進分析層 |

---

## 三條研究路徑

### 路徑一：日常市場掃描
```
觸發：手動執行 /market-scanner
  ↓
呼叫 localhost:8000/buffett/preset/{preset}
  ↓
計算近5日漲幅 ≥5%，過濾市值 <10B，去重（3日冷卻）
  ↓
最多3支，每支200-300字（背景脈絡→飆升原因→注意事項）
  ↓
存 data/scanner/YYYY-MM-DD.md，更新 seen.json
```

### 路徑二：璞玉計畫（大事件觸發）
```
觸發：手動執行 /jade-report [事件]
  ↓
比對 data/regime/current.json 的觸發關鍵詞
  ↓
從 watchlist.json 選 2-3 家最相關公司
  ↓
讀取 data/coverage/supply-chain/{TICKER}.md（讀取 Agent 職能）
  ↓
產出璞玉報告（事件→供應鏈連結→反向風險）
  ↓
存 data/scanner/jade-YYYY-MM-DD-{TICKER}.md
```

### 路徑三：知識庫維護（定期）
```
供應鏈圖譜更新（ai-infra-researcher）
  → 新增公司：更新 watchlist.json + 建立 {TICKER}.md
  → 年度更新：重新抓 10-K + 法說會 transcript
  → 觸發：watchlist 有空缺，或 ai-infra-researcher 發現新標的

Regime Config 更新（CMO）
  → 每週五更新 data/regime/current.json
  → Regime 轉變時：更新 regime / focus_sectors / trigger_keywords
```

---

## 知識庫現況

### 供應鏈圖譜（`data/coverage/supply-chain/`）

| Ticker | 公司 | 定位 |
|---|---|---|
| GLW | Corning | 光纖原料，AI 數據中心光纜 |
| VRT | Vertiv | 數據中心電源與液冷 |
| ANET | Arista Networks | AI 後端乙太網路交換器 |
| KLAC | KLA Corporation | 晶圓製程控制設備 |
| LRCX | Lam Research | HBM 製程設備 |
| COHR | Coherent | 800G/1.6T 光模組 |
| EQIX | Equinix | 數據中心 REIT |
| APD | Air Products | 半導體電子級氣體 |
| ETN | Eaton | 數據中心電力全鏈路 |
| CIEN | Ciena | 數據中心互連光傳輸 |

**新增公司：** 修改 `watchlist.json`，`status` 設 `active`，`add_reason` 必填。

### Regime Config（`data/regime/current.json`）
當前：`AI_capex_cycle`，聚焦 AI 基礎設施 / 光纖 / 電力。下次審查：2026-05-29。

---

## 工具清單

| 指令 | 說明 | 觸發時機 |
|---|---|---|
| `/meeting` | 完整晨會：Secretary + DNI + CEO 洞察推演 | 每日開盤前 |
| `/discuss [主題]` | 臨時專題討論：跳過新聞，直接進 CEO 分析層 | 針對特定問題深挖 |
| `/market-scanner` | 掃描近5日漲幅≥5%科技股，最多3支 | 想看今日市場訊號 |
| `/market-scanner [preset]` | 指定 preset（tech/buffett/dow30/dividend/defensive）| 同上，換池子 |
| `/jade-report [事件]` | 大事件觸發，從知識庫找璞玉標的 | 看到重大產業新聞 |
| `/supply-chain-read [TICKER...]` | 讀取供應鏈 md 轉 JSON，供其他 Agent 使用 | jade-report 內部呼叫，或手動查 |

---

## 資料目錄

```
data/
├── coverage/
│   ├── ai-chips/          # NVDA/AMD/AVGO/QCOM company bible（ai-infra-researcher 維護）
│   └── supply-chain/      # 璞玉計畫供應鏈知識庫
│       ├── watchlist.json # 公司清單，ai-infra-researcher 維護
│       └── {TICKER}.md    # 各公司供應鏈圖譜
├── regime/
│   └── current.json       # CMO 每週更新的 Regime Config
├── scanner/
│   ├── seen.json          # 市場掃描去重記錄（3日冷卻）
│   ├── YYYY-MM-DD.md      # 日常市場掃描結果
│   └── jade-YYYY-MM-DD-{TICKER}.md  # 璞玉報告
├── intel/                 # DNI 新聞資料庫
├── meetings/              # 會議紀錄
├── positions/             # 論點追蹤
└── tracking/
    └── watchlist.json     # Secretary 追蹤指標
```

---

## 日常運作節奏

### 每日

| 時機 | 動作 | 負責 |
|---|---|---|
| 開盤前（隨時） | `/meeting` — Secretary 行事曆 + DNI 新聞，並行執行後進入 Q&A | CEO 主持 |
| 有重大新聞時 | `/jade-report [事件]` — 比對 Regime，產出璞玉報告 | 手動觸發 |
| 有興趣的飆升股 | `/market-scanner` — 掃描近5日漲幅≥5%，最多3支 | 手動觸發 |

### 每週

| 時機 | 動作 | 負責 |
|---|---|---|
| 週五 | CMO 更新 `data/regime/current.json`，判斷 Regime 是否轉變 | CMO |
| 週末 | `/weekly` — 產出週報（若有需要） | CIO |

### 每月

| 時機 | 動作 | 負責 |
|---|---|---|
| 月底或視需要 | `/pmc` — 績效管理委員會，兩種模式：(1) 貼持倉截圖→現況分析 (2) 貼已實現記錄→萃取學習存案例庫 | CEO 主持 |

### 定期維護

| 頻率 | 動作 | 負責 |
|---|---|---|
| 財報後 | ai-infra-researcher 更新 NVDA/AMD/AVGO/QCOM company bible | ai-infra-researcher |
| 法說會後（Q1）| 重新抓 transcript，更新供應鏈 md | ai-infra-researcher |
| 有新標的時 | 更新 `watchlist.json` + 建立 `{TICKER}.md` | ai-infra-researcher |

### 晨會流程（`/meeting` 執行順序）

```
0. Secretary 先讀上次會議紀錄（data/meetings/ 最新檔）
   └── 報告：上次裁定 + 本次應追蹤事項

1. Secretary + DNI 並行啟動
   ├── Secretary：財報日/FOMC/重要數據行事曆 + watchlist 追蹤結果
   └── DNI：財經/科技/地緣政治/軍事四類新聞

2. CEO 整合輸出，呈現給董事長

3. Q&A 模式，董事長提問後調度對應 Agent：
   ├── 個股（NVDA/AMD/AVGO/QCOM）→ ai-infra-researcher
   ├── 宏觀 / Regime              → CMO
   ├── 產業分析                   → industry-analyst
   ├── 財報細節                   → earnings-analyst
   └── 技術前沿                   → CTO
```

---

*最後更新：2026-05-22*
