# /earnings-call-scan：法說會橫向掃描

**用法：** `/earnings-call-scan [產業或主題]`

從多家公司的最新法說會 transcript 中，提取同一主題的關鍵發言，橫向比較 CEO/CFO 的措辭與態度。純數據採集，不做判斷。

**典型用途：** 「這季 AI 基礎設施相關公司的 CEO 都在說什麼？」

---

## 執行流程

```
確認掃描公司名單 → 並行抓取各家 transcript → 提取主題關鍵句 → 輸出橫向比較表
```

---

## 步驟 1：確認掃描公司名單

**優先讀取現有知識庫：**

1. 讀 `data/industry/{slug}.json`（若存在）→ 取 `top_candidates` 作為起點
2. 讀 `data/regime/current.json` → 取 `focus_sectors` 確認方向
3. 讀 `data/coverage/supply-chain/watchlist.json` → 補充相關公司

若知識庫無對應資料，用 WebSearch 找：
```
「[產業/主題] top companies earnings Q1 2026」
```

**目標：3-6 家公司**，涵蓋供應鏈不同層次（需求端 + 關鍵供應商 + 基建層）

輸出確認清單：
```
掃描名單：NVDA / AVGO / MSFT / META / QCOM / SMCI
主題關鍵字：[inference demand / AI capex / data center / ...]
最新季度：Q[N] 2026（截至 YYYY-MM-DD）
```

若名單超過 6 家，詢問是否縮小範圍。

---

## 步驟 2：並行搜尋各家 transcript

對每家公司，依序嘗試以下來源（取到即停）：

**來源優先序：**
1. 公司 IR 官網：`[TICKER] investor relations earnings call transcript 2026`
2. Seeking Alpha：`[TICKER] earnings call transcript Q[N] 2026 site:seekingalpha.com`
3. Motley Fool：`[TICKER] earnings call Q[N] 2026 site:fool.com`
4. 財報新聞摘要：`[TICKER] Q[N] 2026 earnings call highlights key quotes`

**每家公司取得：**
- 法說日期
- 參與發言者（CEO/CFO/President）
- 關鍵原文片段（3-5 句，英文原文）

若找不到 transcript，填「本季 transcript 未取得」，繼續下一家。

> ⚠️ 原文保留英文，不翻譯，避免語意失真。

---

## 步驟 3：提取主題關鍵句

對每家公司的 transcript，針對輸入主題提取相關發言：

**關鍵字對應表（常用主題）：**

| 主題 | 搜尋關鍵字 |
|---|---|
| AI 資本支出 | capex, capital expenditure, data center investment, infrastructure spending |
| 需求信號 | demand, backlog, pipeline, bookings, visibility |
| 供給瓶頸 | supply, constraint, shortage, lead time, allocation |
| 定價能力 | pricing, ASP, price increase, margin |
| 地緣政治 | China, export control, tariff, geopolitical |
| 客戶行為 | customer, hyperscaler, cloud, enterprise |

若輸入主題不在上表，自行判斷對應關鍵字並列出。

---

## 步驟 4：輸出橫向比較表

格式：

```
## 法說會掃描｜[主題]｜[YYYY] Q[N]

掃描公司：[TICKER1] / [TICKER2] / [TICKER3] ...
掃描日期：YYYY-MM-DD

---

### 需求信號

| 公司 | 發言者 | 原文關鍵句 | 態度 |
|---|---|---|---|
| NVDA | CEO Jensen Huang | "We see demand that far exceeds supply..." | 🟢 強勁 |
| AVGO | CEO Hock Tan | "Our AI revenue doubled year-over-year..." | 🟢 強勁 |
| MSFT | CFO Amy Hood | "We expect continued growth but acknowledge some digestion..." | 🟡 審慎 |
| SMCI | CEO Charles Liang | "..." | 🔴 保守 |

---

### 供給/交期

| 公司 | 發言者 | 原文關鍵句 | 態度 |
|---|---|---|---|

---

### 定價能力

| 公司 | 發言者 | 原文關鍵句 | 態度 |
|---|---|---|---|

---

### 地緣政治 / 出口管制（若有提及）

| 公司 | 發言者 | 原文關鍵句 | 態度 |
|---|---|---|---|

---

## 橫向觀察（純描述，不判斷）

- **共識方向**：{多數公司在 [主題] 上的一致表述}
- **分歧點**：{有哪家公司措辭與其他家明顯不同}
- **新出現的措辭**：{本季首次出現、上季沒有的關鍵詞}
- **消失的措辭**：{上季常提、本季不再提的關鍵詞}
```

**態度判定標準（純描述）：**
- 🟢 強勁：明確正面，有具體數字支撐
- 🟡 審慎：正面但加保留措辭，或方向不確定
- 🔴 保守：明確轉弱，或刻意迴避具體承諾
- ⚪ 未提及：transcript 中未找到相關發言

---

## 步驟 5：輸出數據包尾註

```
─────────────────────────────
以上為法說會原始發言摘錄，不含投資判斷。

可接續的步驟：
  → 餵入 /industry-scan 作為需求訊號補充
  → 餵入 /industry-analysis 強化需求斜率分析
  → 餵入 /earnings-analyst 比對單一個股論點
─────────────────────────────
```

---

## 規則

- **原文優先**：關鍵句保留英文原文，不意譯
- **找不到就空白**：不推測 management 可能說什麼
- **態度是描述，不是判斷**：🟢/🟡/🔴 只描述措辭強度，不代表投資建議
- **不超過 6 家公司**：太多反而失焦，寧可選代表性的
