# /supply-chain-read：供應鏈知識庫讀取器

**用法：** `/supply-chain-read [TICKER1] [TICKER2] ...` 或 `/supply-chain-read all`

供其他 Agent 呼叫的資料中間層。讀取指定公司的供應鏈 md 檔，轉成結構化 JSON 輸出至對話，避免重複讀檔。

---

## 執行步驟

### Step 1：解析輸入

- 若輸入為 `all`：讀取 `data/coverage/supply-chain/watchlist.json`，取出所有 `status: "active"` 的 ticker 清單
- 若輸入為 ticker 清單：直接使用，但先確認每個 ticker 在 watchlist 中存在；不存在的跳過並說明

### Step 2：逐一讀取 md 檔

對每個 ticker，讀取：
```
data/coverage/supply-chain/{TICKER}.md
```

解析 frontmatter 與各節內容，萃取以下欄位：

```json
{
  "ticker": "",
  "name": "",
  "updated": "",
  "source": "",
  "upstream": {
    "U1": [{"entity": "", "item": "", "share": ""}],
    "U2": [{"entity": "", "item": "", "share": ""}]
  },
  "downstream": {
    "D1": [{"entity": "", "item": "", "share": ""}],
    "D2": [""],
    "D3": [""]
  },
  "substitution_risk": [{"tech": "", "timeline": ""}],
  "triggers": [""]
}
```

- 無資料的欄位填 `null`，不省略 key
- 每層最多 2 筆，與 md 一致

### Step 3：輸出

在對話中輸出完整 JSON，格式：

```json
{
  "generated": "YYYY-MM-DD",
  "companies": [
    { ...公司1 },
    { ...公司2 }
  ]
}
```

輸出後說明：「已載入 N 家公司知識庫，可供寫作 Agent 使用。」

---

## 規則

- 只讀不寫，不修改任何檔案
- 若 md 檔不存在，說明缺檔並跳過，不中止整個流程
- 不做分析、不加評論，純粹格式轉換
