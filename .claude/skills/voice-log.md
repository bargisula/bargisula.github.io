# voice-log

觸發方式：使用者說「/voice-log」「抓陸行之」「更新觀點庫」「抓 [人名] 最新看法」

---

## 功能

從媒體搜尋市場人物/機構的最新觀點，解析立場（看多/看空/轉向），寫入 `data/voices/records/[人名].json`。

## 執行步驟

### Step 1：讀取追蹤名單

```
Read: data/voices/registry.json
```

確認要更新哪些 voice（若使用者指定人名則只跑該人，否則跑全部 active:true 的）。

### Step 2：WebSearch 抓最新觀點

對每個 voice，執行：

```
WebSearch: "[name] 半導體 AI 看法 [YYYY年M月]"
WebSearch: "[name] site:technews.tw [YYYY]"
WebSearch: "[name] [主要標的] 看多 OR 看空 [YYYY]"
```

抓取目標：
- 觀點的標的（個股/產業/宏觀）
- 立場（看多/看空/中性/轉向）
- 核心論點（2-3 點）
- 來源網址與日期

### Step 3：讀取現有紀錄，判斷是否轉向

```
Read: data/voices/records/[人名].json
```

取最後一筆的 `stance`，與本次比對：
- 若立場改變 → `stance_change: true`，在輸出中標注 ⚠️ 立場轉向
- 若無改變 → `stance_change: false`

### Step 4：寫入新紀錄

追加一筆到 `records` 陣列，格式：

```json
{
  "id": "[人名]-[主題]-[YYYYMMDD]",
  "date": "YYYY-MM-DD",
  "analyzed_date": "YYYY-MM-DD",
  "ticker": "NVDA 或 null（宏觀/產業看法）",
  "sector": "半導體/AI/宏觀...",
  "view_type": "個股 | 產業 | 宏觀 | 資產類別",
  "stance": "看多 | 看空 | 中性 | 轉向",
  "target_price": null,
  "rating": null,
  "summary": "一句話觀點",
  "key_reason": ["論點1", "論點2", "論點3"],
  "tickers_mentioned": ["個股清單"],
  "source_url": "https://...",
  "source_type": "媒體報導 | YouTube標題 | 推文 | 報告",
  "prev_stance": "上一筆的 stance",
  "stance_change": false,
  "tags": ["標籤1", "標籤2"]
}
```

### Step 5：對話輸出摘要

輸出格式：

```
## 觀點更新｜[人名]｜[日期]

**標的/主題：** [ticker 或產業]
**立場：** [看多/看空/中性] [若轉向：⚠️ 立場轉向（前次：XXX）]
**摘要：** [一句話]
**核心論點：**
- [論點1]
- [論點2]
**提到個股：** [清單]
**來源：** [連結]

✅ 已寫入 data/voices/records/[人名].json
```

## 規則

- 若同一人同一天已有紀錄，詢問是否覆蓋或追加
- 若找不到近 30 天的新觀點，輸出「未找到新觀點，最後記錄為 [日期]」，不寫入
- 不捏造數據，找不到就說找不到
- 立場轉向（`stance_change: true`）必須在輸出中標注 ⚠️，這是最高優先信號
