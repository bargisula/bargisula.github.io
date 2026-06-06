# data-fetcher：原始資料抓取 Skill

**Layer 1 執行者。只做三件事：抓取、去重、存檔。不分析、不判斷。**

**觸發方式：**
- 其他 agent 呼叫（dsmm-analyst / industry-knowledge / jade-scan）
- 董事長說「抓 {TICKER} {文件類型}」

---

## 輸入格式

```
ticker:    CIEN          # 必填
doc_type:  transcript    # 必填：transcript / 8-K / 10-Q / 10-K
period:    Q2FY2026      # 選填，不填則抓最新
date_hint: 2026-06-06    # 選填，協助定位
```

---

## Step 1：去重檢查（先查再抓）

讀取 `data/knowledge/scan-log.json`，查詢此 ticker + doc_type 組合：

- 若 `data/raw/{TICKER}/{doc_type}-{period}.txt` 已存在 → **直接回傳路徑，不重抓**
- 若 scan-log 顯示此文件 8 週內已抓且無更新 → **回傳快取路徑**
- 否則 → 繼續 Step 2

---

## Step 2：依文件類型抓取

### transcript（電話會議逐字稿）— 最高優先
按順序嘗試，成功即停：

① Seeking Alpha（最完整）：
```
WebSearch: "{COMPANY} {QUARTER} earnings call transcript site:seekingalpha.com"
```
取前 8,000 字（含 Prepared Remarks + Q&A）。

② 公司 IR 官網：
```
WebSearch: "{COMPANY} investor relations {YEAR} {QUARTER} earnings transcript"
```

③ Motley Fool / The Street：
```
WebSearch: "{TICKER} earnings call transcript {QUARTER} {YEAR} site:fool.com"
```

④ 若全部失敗 → 抓 8-K Exhibit 99.1 代替，標記 `fallback: true`。

### 8-K（重大事件公告）
```bash
curl -H "User-Agent: bargisula@gmail.com data-fetcher/1.0" \
  "https://efts.sec.gov/LATEST/search-index?q=%22%22&dateRange=custom&startdt={DATE-7d}&enddt={DATE}&forms=8-K&entity={COMPANY}"
```
取 Exhibit 99.1（前 3,000 字）+ Item 2.02。

### 10-Q（季報）
```
WebSearch: "{TICKER} 10-Q {QUARTER} {YEAR} SEC EDGAR filing"
```
重點段落：Management Discussion、Revenue Breakdown、Major Customers、Risk Factors 新增項目。

### 10-K（年報）
```
WebSearch: "{TICKER} 10-K {YEAR} annual report SEC EDGAR"
```
重點段落：Business Description、Competition、Supply Chain、Risk Factors。

---

## Step 3：存檔

**路徑規則：**
```
data/raw/{TICKER}/{doc_type}-{period}.txt
```

範例：
```
data/raw/CIEN/transcript-Q2FY2026.txt
data/raw/NVDA/8-K-2026-05-28.txt
data/raw/GLW/10-Q-Q1FY2026.txt
```

**存入內容：**
- 第一行：`# SOURCE: {來源 URL 或描述}`
- 第二行：`# FETCHED: {抓取日期}`
- 第三行：`# FALLBACK: true/false`
- 空行
- 原始文字（不清洗、不摘要）

---

## Step 4：更新 scan-log.json

追加一條記錄：
```json
{
  "ticker": "CIEN",
  "doc_type": "transcript",
  "period": "Q2FY2026",
  "fetch_date": "2026-06-06",
  "file_path": "data/raw/CIEN/transcript-Q2FY2026.txt",
  "source": "Seeking Alpha",
  "fallback": false,
  "char_count": 7842
}
```

---

## Step 5：回傳

```
✅ data-fetcher 完成
  檔案：data/raw/CIEN/transcript-Q2FY2026.txt
  來源：Seeking Alpha
  字數：7,842
  快取：新抓取（非快取）
```

或快取命中：
```
⚡ data-fetcher 快取命中
  檔案：data/raw/CIEN/transcript-Q2FY2026.txt（2026-06-06 已抓）
  直接使用，跳過重抓。
```

---

## 不做的事
- 不解讀文字內容
- 不做關鍵詞比對
- 不判斷重要性
- 不寫 inbox
- 不更新 edges.json

分析工作全部交給呼叫方（dsmm-analyst / industry-knowledge / jade-scan）。
