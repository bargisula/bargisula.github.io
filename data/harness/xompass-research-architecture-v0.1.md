# Xompass 研究架構設計文件 v0.1

**建立：** 2026-06-06
**狀態：** 設計階段，待下次開工分配執行者
**下次起點：** 把三個觸發組分配給具體的 agent / skill

---

## 北極星

> 給定任何一支美股或總經事件，Xompass 能在 2 小時內產出一份初級分析師需要 2 週才能完成的研究，附有明確來源、可被證偽的結論，並自動整合進現有論點體系。

---

## 四個產出

| 產出 | 頻率 | 核心內容 | 讀者 |
|---|---|---|---|
| **晨報** | 每個交易日 | 市場數字 + 議題 + 裁定（白話） | 一般人看得懂 |
| **專案報告** | 每週 + 事件驅動 | 總經 / 產業 / 璞玉 / 個股 + 本週討論（可空） | 深度閱讀 |
| **快訊** | 即時 | 訊號記錄，存檔，不影響其他產出 | 內部備查 |
| **知識庫** | 持續更新 | 傳導鏈 + 知識圖譜 | 系統使用 |

---

## 知識層次（DIKW）

| 層次 | 說明 | Xompass 現況 | 缺口 |
|---|---|---|---|
| 資料 | 原始數字、申報、新聞原文 | DNI / jade-scan / earnings-analyst 抓取 | 電話會議逐字稿無標準抓取流程 |
| 資訊 | 整理過的訊號、摘要、分類 | jade-scan 過濾、DNI 分類、財報摘要 | 資訊升格知識無門檻規則 |
| 知識 | 框架化理解：產業結構、供應鏈關係、Regime | insights.json / edges.json / Bible / Regime | 宏觀→個股傳導在財務層斷掉 |
| Bible | 帶條件的判斷：論點何時成立、何時失效 | company bible（IF 正向條件 + kill switch）| 反向 IF 缺失（單向論點） |
| 智慧 | 跨案例模式：什麼情境下什麼判斷會錯 | 幾乎空白 | PMC 案例庫不存在；Feedback 未閉合 |

---

## 四個資料來源（美股，目前範圍）

| 來源 | 位置 | 特性 | 主要用途 |
|---|---|---|---|
| **電話會議逐字稿** | 公司 IR 官網 / Seeking Alpha | Q&A 語氣、供需表述——訊號最豐富 | Group A 觸發主力 |
| **8-K** | SEC EDGAR | 正式數字、官方指引 | 指引變化偵測 |
| **10-Q** | SEC EDGAR | 季度財務、客戶集中度 | 論點條件驗證 |
| **10-K** | SEC EDGAR | 業務描述、競爭、供應鏈 | 知識庫底層建構 |

---

## 三個觸發組

### Group A：機會訊號
> 供應鏈在動，可能有新標的

```
觸發條件（任一）：
- 供需關鍵詞命中（電話會議）
- Design win / 新客戶出現（電話會議）
- Backlog QoQ 變化 >20%（10-Q）

下游動作：jade-scan → inbox → 晨會議題
```

### Group B：論點健檢
> 我現有的論點還成立嗎

```
觸發條件（任一）：
- 指引砍幅 >10%（8-K）
- Major Customer 新增或消失（10-Q / 10-K）
- 毛利連兩季逆轉（10-Q）

下游動作：比對 company bible 條件 → 更新 insights.json confidence
```

### Group C：知識庫更新
> 世界結構變了，圖譜要更新

```
觸發條件（任一）：
- 超大雲端 capex 指引變化（電話會議）
- 新競爭者出現（10-K）
- 供應商客戶關係描述變化（10-K）

下游動作：更新 edges.json / flag CMO 更新 DSMM
```

---

## 自動迭代更新邏輯

```
觸發點偵測到
  ↓
自動拉對應資料段落
  ↓
與知識庫現有狀態比對
  ↓
  ├── 有變化
  │     ├── 變化小 → 自動更新知識庫 + 寫 log，不打擾人
  │     └── 變化大 → 自動更新 + 晨會帶入議題
  │
  └── 無變化
        → 更新 last_checked 時間戳，結束
```

**大小變化判斷標準：**

| Group | 小變化（自動更新） | 大變化（升級晨會） |
|---|---|---|
| A 機會訊號 | 已覆蓋公司再度命中 | 新公司首次命中 |
| B 論點健檢 | confidence 調整 ≤0.1 | confidence 調整 >0.1 或 kill switch 接近 |
| C 知識庫更新 | edges.json 新增一條邊 | DSMM 傳導鏈需要改方向 |

---

## 資料矩陣（執行者 + 存檔位置）

| | 晨報 | 專案報告 | 知識庫 |
|---|---|---|---|
| **資料** | `market-data`(AGENT) → 無存檔<br>`DNI`(AGENT) → `data/intel/YYYY-MM-DD.json`<br>`jade-scan`(SKILL) → `data/jade/inbox/*.json` | `earnings-analyst`(AGENT) → ❌ 無存檔<br>`industry-analyst`(AGENT) → `src/content/notes/...mdx`<br>`jade-scan`(SKILL) → `data/jade/inbox/*.json` | `DNI`(AGENT) → `data/intel/news.db`<br>`jade-scan`(SKILL) → `data/knowledge/scan-log.json`<br>❌ 其餘無存檔 |
| **資訊** | `DNI`(AGENT) → `data/intel/YYYY-MM-DD.json`<br>`secretary`(AGENT) → ❌ 無存檔<br>`jade-scan`(SKILL) → `data/jade/inbox/*.json` | `earnings-analyst`(AGENT) → ❌ 無存檔<br>`jade-report`(SKILL) → `data/scanner/jade-*.md`<br>`CMO`(AGENT) → `data/regime/current.json` | ❌ 無升格規則，無執行者 |
| **知識** | 讀 `data/regime/current.json`<br>讀 `data/insights/insights.json`<br>讀 `data/tracking/picks.json`<br>讀 `data/knowledge/edges.json` | `CMO`(AGENT) 讀寫 `data/regime/current.json`<br>`ai-infra-researcher`(AGENT) 讀寫 `data/coverage/**`<br>讀 `data/knowledge/edges.json` | 寫：`data/insights/insights.json`<br>寫：`data/knowledge/edges.json`<br>寫：`data/coverage/**/*.json`<br>寫：`data/bible/*.md`<br>寫：`data/regime/current.json` |
| **智慧** | ❌ 無 | ❌ 無 | ❌ `data/pmc/cases/` 不存在<br>❌ `data/insights/audit_log.json` 空白 |

---

## 下次開工的起點

### 待定事項：分配執行者

把三個觸發組對應到具體 agent / skill：

```
Group A 機會訊號
  → jade-scan 需要加電話會議逐字稿抓取能力
  → 目前：用 8-K Exhibit 99.1 + WebSearch 補充（品質不穩定）
  → 待建：標準電話會議逐字稿抓取流程

Group B 論點健檢
  → earnings-analyst 需要「比對 bible 條件」的標準輸出
  → 目前：財報分析輸出到對話，不存檔，不比對
  → 待建：earnings-analyst 產出結構化 JSON，自動比對 bible

Group C 知識庫更新
  → 目前無執行者
  → 待建：新 skill 或擴充 ai-infra-researcher
```

### 其他待補缺口

1. `market-data` 和 `secretary` 無存檔 → 需要定存檔格式
2. `earnings-analyst` 無存檔 → 需要定 `data/earnings/{TICKER}-{YYYYQQ}.json`
3. Bible 反向 IF 缺失 → 每條 bible 需補「論點若錯，預期看到什麼」
4. 智慧層空白 → PMC 案例庫格式待定義
