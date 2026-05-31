# /earnings-analyst：財報論點分析引擎

**用法：** `/earnings-analyst [TICKER]`

讀取最新財報數據，逐一對照既有投資論點，裁定論點是否仍成立，並將結果寫回 Bible。

**核心問題：這份財報讓論點更站得住腳，還是開始動搖？**

---

## 執行流程

```
讀背景（Bible + Regime + 產業結論）
    ↓
確認財報數據（讀現有或觸發 /earnings 採集）
    ↓
逐支柱比對論點
    ↓
檢查 Kill Switch
    ↓
整體裁定
    ↓
寫回 Bible + 選擇性輸出財報筆記
```

---

## 步驟 1：讀取背景

### A. 讀取 Bible（必填）

路徑（依序嘗試）：
```
data/coverage/ai-chips/{TICKER}.json
data/coverage/ai-infra-adjacent/{TICKER}.json
data/coverage/supply-chain/{TICKER}.md
```

取得：
- `thesis`：核心論點與支柱清單
- `conditions`：論點成立的必要條件
- `kill_switches`：論點失效的觸發條件
- `financials`（若有）：上次記錄的財務快照

若 Bible 不存在 → 輸出「{TICKER} 尚無 Bible，建議先執行 /stock-pick 建立論點後再跑財報比對」，詢問是否仍繼續（繼續則僅輸出財報觀察，不做論點比對）。

### B. 讀取當前 Regime

```
data/regime/current.json
```

取得 `regime_grid.quadrant`、`focus_sectors`、`risk_posture`，作為解讀財務數字的宏觀背景。

### C. 讀取產業結論（若存在）

根據 TICKER 所屬產業，嘗試讀取 `data/industry/{slug}.json`：
- 取 `verdict`、`kill_switches`：確認產業層級是否有新的負面訊號影響此股

---

## 步驟 2：確認財報數據來源

**若使用者剛跑過 /earnings** → 直接使用對話中的數據包。

**若無現成數據** → 自動觸發 earnings skill 採集：
```
執行 earnings 採集流程（步驟1-3）
輸出數據包後繼續分析，不需使用者確認
```

---

## 步驟 3：逐支柱論點比對

從 Bible 取出每個論點支柱，逐一對照本季財務數據：

| 論點支柱 | Bible 中的條件 | 本季數據 | 判定 |
|---|---|---|---|
| {支柱一} | {成立條件，例：毛利率維持 > 60%} | {實際值} | 支撐 / 中性 / 挑戰 |
| {支柱二} | | | |
| {支柱三} | | | |

**判定標準：**
- **支撐**：財務數據方向與論點一致，且幅度符合預期
- **中性**：無顯著影響，不強化也不弱化
- **挑戰**：財務數據方向與論點相反，或幅度明顯落後預期

**Guidance 對照（必填）：**

| 項目 | 論點預期 | 本季 guidance | 缺口 |
|---|---|---|---|
| 營收成長 | {Bible 中的預期} | {實際 guidance} | 超預期/符合/低於 |
| 毛利率 | | | |

---

## 步驟 4：Kill Switch 檢查

從 Bible 取出每個 Kill Switch，逐一確認：

| Kill Switch | 觸發條件 | 本季狀態 | 判定 |
|---|---|---|---|
| K1 | {具體條件} | {本季數據} | 未觸發 / 接近 / 已觸發 |
| K2 | | | |

**「接近」的定義：** 距離觸發門檻 < 20%，或方向持續惡化超過兩季。

---

## 步驟 5：整體裁定

根據步驟 3-4 結果，給出整體裁定：

```
【財報裁定｜{TICKER}｜{YYYY} Q{N}】

整體裁定：論點成立 / 論點弱化 / 論點失效

核心理由（2-3 句）：
{最重要的支撐或挑戰是什麼，要有具體數字}

論點支柱狀態：
- 支柱一：支撐 / 中性 / 挑戰
- 支柱二：...

Kill Switch 狀態：
- K1：未觸發（距門檻 X%）/ 接近 / 已觸發
- K2：...

下次確認點：
- {日期}：{事件}——驗證 {哪個支柱或 Kill Switch}
```

**裁定標準：**
- **論點成立**：主要支柱均「支撐」或「中性」，無 Kill Switch 接近觸發
- **論點弱化**：≥1 個主要支柱被「挑戰」，或有 Kill Switch「接近」
- **論點失效**：核心支柱被「挑戰」，或任一 Kill Switch「已觸發」

---

## 步驟 6：寫回 Bible

強制更新以下欄位（不得略過）：

```json
{
  "financials": {
    "snapshot_date": "YYYY-MM-DD",
    "quarter": "YYYY-Q[N]",
    "revenue": "...",
    "gross_margin": "...",
    "eps": "...",
    "guidance_next_q": "..."
  },
  "thesis_status": "intact | weakened | broken",
  "last_earnings_check": "YYYY-MM-DD",
  "kill_switch_status": {
    "K1": "clear | approaching | triggered",
    "K2": "clear | approaching | triggered"
  }
}
```

git commit：
```
git add data/coverage/.../{TICKER}.json
git commit -m "analysis: {TICKER} 財報論點更新 {YYYY}-Q{N}"
```

---

## 步驟 7：選擇性輸出財報筆記

裁定完成後詢問：

```
─────────────────────────────
裁定完成。是否輸出財報筆記推部落格？

  「發布」→ 輸出 MDX，推到 src/content/notes/投資/美股/{TICKER}-財報-{YYYY}-Q{N}.mdx
  「不用」→ 結束，Bible 已更新
─────────────────────────────
```

若選發布，frontmatter：
```yaml
---
title: '【財報】{TICKER} {YYYY} Q{N}｜{論點裁定一句話，15字內}'
description: '{核心財務變化 + 論點裁定，60字內}'
category: '投資'
subcategory: '美股'
topic: '財報分析'
pubDate: 'YYYY-MM-DD'
---
```

文章主體：直接輸出步驟 3-5 的比對結果，不重複基礎財務描述。

---

## 規則

- **必須讀 Bible 再比對**，沒有論點就沒有比對，不硬做「通用財報分析」
- **裁定必須有數字**：「論點弱化」後面必須跟「因為毛利率 58.3%，低於 60% 的門檻」
- **Bible 必須在步驟 6 更新**，不論裁定結果如何
- 不做股價預測，不推薦買賣
