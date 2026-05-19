# 系統設計總覽

> 本文件記錄 bargisula.github.io 的 AI agent 系統架構設計，供 CEO agent 稽核與董事長參考。
> 最後更新：2026-05-19

---

## 組織架構

```
董事長
├── 秘書（開會觸發，報行程，零決策）
│
├── CEO（系統健康診斷）
│
├── 投資線
│   ├── CIO（整合投資報告）
│   │   ├── market-data（數據採集）
│   │   ├── news-scout（新聞精選）
│   │   ├── macro-scan-auto（週日總經掃描）
│   │   └── us-pre / us-post / tw-pre / tw-post（盤前後報告）
│   ├── 首席經濟學家（regime 判讀，整合 usstock 輸出）
│   ├── CTO（科技前沿，識別未定價技術變化）
│   └── 研究部
│       ├── AI基礎設施研究員（NVDA / AMD / QCOM / AVGO）
│       ├── 科技平台研究員（AAPL / MSFT / GOOGL / META）
│       └── 電動車研究員（TSLA）
│
└── 內容線（Gemini CLI 負責，不在 Claude 系統內）
    ├── 勞動日報
    ├── 軍事日報
    └── 理財日報
```

---

## 角色清單

### 已建立

| 角色 | 類型 | 功能 |
|---|---|---|
| CEO | Agent | 系統健康診斷：audit / strategy / system / memory / token 五種模式 |
| CIO | Agent | 整合各 agent 輸出，產完整投資報告 |
| market-data | Agent | 數字採集，只回表格，不分析 |
| news-scout | Agent | 精選新聞 2-3 則，附一句洞察 |
| industry-analyst | Agent | 產業深度分析，產出完整 MDX 報告 |
| us-pre / us-post | Agent | 美股盤前後報告，自動排程 |
| tw-pre / tw-post | Agent | 台股盤前後報告，自動排程 |
| macro-scan-auto | Agent | 週日 10:20 自動總經掃描，risk-on/off 判斷 |
| /stock-scan | Skill | 個股快速五維掃描，on-demand |
| /flash | Skill | 隨手記錄市場快訊 |
| /flashlog | Skill | 查閱本月快訊 |
| /ceo | Skill | 呼叫 CEO 各診斷模式 |

### 待建立

| 角色 | 類型 | 功能 | 關鍵設計 |
|---|---|---|---|
| 秘書 | Skill | 「開會」觸發，報今日行程、本週重點、建議召集誰，零決策 | 最簡單，可優先建立 |
| CTO | Agent | 追蹤科技前沿（AI 論文、晶片架構、biotech），識別未被市場定價的技術變化 | 與 industry-analyst 不同：看未來而非現有產業 |
| 首席經濟學家 | Agent | 讀取 usstock regime 計算結果，判讀景氣座標（成長×通膨四象限）、達里歐週期、下一個轉折條件 | 需整合本機 usstock 專案；usstock 負責計算，首席經濟學家負責敘事 |
| AI基礎設施研究員 | Agent | 追蹤 NVDA / AMD / QCOM / AVGO，維護 company bible JSON，產財報筆記與論點更新 | 有狀態設計：`data/coverage/ai-chips/*.json`，需排程 |
| 科技平台研究員 | Agent | 追蹤 AAPL / MSFT / GOOGL / META，同上 | 同上：`data/coverage/tech-platform/*.json` |
| 電動車研究員 | Agent | 追蹤 TSLA，同上 | 同上：`data/coverage/ev/*.json` |

---

## 研究員設計原則

### Company Bible（公司檔案）
每個受追蹤公司維護一個 JSON，存於 `data/coverage/[組別]/[TICKER].json`：

```json
{
  "ticker": "NVDA",
  "thesis": "當前投資論點一句話",
  "rating": "追蹤",
  "price_target": 145,
  "last_updated": "2026-05-19",
  "key_metrics": {
    "revenue_growth_yoy": "122%",
    "gross_margin": "78%"
  },
  "watch_triggers": ["觀察指標1", "觀察指標2"],
  "thesis_risk": "論點最大失效條件"
}
```

### 三種輸出類型
| 類型 | 觸發時機 | 長度 |
|---|---|---|
| 開始覆蓋（IOC） | 第一次追蹤 | 長篇 MDX |
| 財報筆記 | 財報發布後 24 小時內 | 短篇 |
| 論點更新 | 重大消息（法規、新產品、併購） | 中篇 |

### 覆蓋清單（初始）
```
data/coverage/registry.json   ← 各組覆蓋的股票清單
data/coverage/ai-chips/       NVDA, AMD, QCOM, AVGO
data/coverage/tech-platform/  AAPL, MSFT, GOOGL, META
data/coverage/ev/             TSLA
data/calendar/earnings.json   ← 近期財報日期，每週更新
data/calendar/fomc.json       ← Fed 會議日期，季度更新
```

---

## 每日運行模式

| 時間 | 角色 | 動作 | 產出 |
|---|---|---|---|
| 06:00 | us-post | 自動執行 | 美股盤後報告 |
| 08:30 | tw-pre | 自動執行 | 台股盤前報告 |
| 13:35 | tw-post | 自動執行 | 台股盤後報告 |
| 21:30 | us-pre | 自動執行 | 美股盤前報告 |
| 隨時 | /flash | 手動觸發 | 市場快訊記錄 |
| 視素材 | Gemini | 手動觸發 | 勞動/軍事/理財日報 |

**每日固定產出**：4 篇市場報告

---

## 每週運行模式

| 時機 | 角色 | 動作 | 產出 |
|---|---|---|---|
| 週一早上 | 秘書 | 董事長說「開會」觸發 | 週前簡報（本週財報/數據/建議召集誰）|
| 週一 | 研究員（三組）| 自動排程週更新 | Company Bible 更新 + 週更筆記 |
| 週中 | usstock | 本機手動觸發 | Regime 計算結果 |
| 週中 | 首席經濟學家 | 讀 usstock 輸出 | Regime 判讀報告 |
| 週中 | news-scout（地區版）| 視需要觸發 | 中國/日本/韓國/印度/歐洲週報 |
| 週日 10:20 | macro-scan-auto | 自動執行 | 總經週掃描報告 |

**每週固定產出**：1 份秘書簡報 + 研究員週更 + 1 份 regime 報告 + 1 份總經掃描

---

## 每月運行模式

| 時機 | 角色 | 動作 | 產出 |
|---|---|---|---|
| 月初 | /ceo audit | 董事長觸發 | 抽查 5 篇文章，給修改建議 |
| 月中 | CTO | 觸發科技簡報 | 上月重大技術發展整理 |
| 月底 | 首席經濟學家 | 觸發月報 | Regime 是否轉移、下月觀察重點 |
| 月底 | /ceo strategy | 董事長觸發 | 內容缺口檢視、是否需要新角色 |

**每月固定產出**：內容稽核報告 + 科技前沿簡報 + 月度 regime 分析 + 系統策略建議

---

## 績效衡量

### 內容產出量
| 指標 | 目標 |
|---|---|
| 每週文章數 | ≥ 15 篇 |
| 七大分類月覆蓋率 | 每類至少 2 篇 |
| 盤前後報告準時率 | ≥ 95% |

### 系統可靠度
| 指標 | 目標 |
|---|---|
| 自動排程成功率 | ≥ 95% |
| Frontmatter 合規率 | 100%（CEO audit 檢查）|
| 研究員財報筆記及時性 | 財報後 24 小時內 |

### 覆蓋完整度
| 指標 | 目標 |
|---|---|
| 覆蓋清單個股週更新率 | 100% |
| Regime 判讀每週產出 | 是／否 |

### 董事長季度自評（無法量化，需主觀判斷）
- 這份資訊有沒有讓理解比之前更深？
- 有沒有太多噪音？
- 有沒有漏掉重要事件？

---

## 設計決策記錄（決定不建的角色）

| 角色 | 原因 |
|---|---|
| Quant Analyst | usstock 已涵蓋計算，首席經濟學家負責解讀，無需獨立角色 |
| 地緣政治分析師 | Gemini 日報已覆蓋，深度文章手動維護，重複建置無意義 |
| 地區週報 Skill | news-scout 帶地區參數即可，不值得獨立 skill |
| 跨資產分析師 | 金融市場只用於寫文章，首席經濟學家兼顧利率匯率背景 |
| 金融市場研究員 | 無跨資產配置需求，現有工具已足夠 |
