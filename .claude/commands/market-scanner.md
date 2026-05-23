# /market-scanner：市場5日飆升掃描器

**用法：** `/market-scanner` 或 `/market-scanner [preset]`

可用 preset：`tech`（預設）、`buffett`、`dow30`、`dividend`、`defensive`

---

## 執行步驟

### Step 1：讀取去重記錄

讀取 `data/scanner/seen.json`，記錄哪些 ticker 最近已被報告過。

格式：`{"TICKER": "YYYY-MM-DD", ...}`

**去重規則：** 同一 ticker 在 3 個自然日內不重複出現。今天日期與 seen.json 中的日期差 < 3 天則跳過。

---

### Step 2：抓取股票清單

```
GET http://localhost:8000/buffett/preset/{preset}
```

若未指定 preset，使用 `tech`（科技龍頭，20 支）。

取出 `stocks[]` 陣列中每支股票的 `symbol`。

---

### Step 3：計算 5 日漲幅

對每支 symbol（跳過 seen.json 中 3 日內已出現的）：

```
GET http://localhost:8000/stock/{ticker}/history
```

計算：
```
5日漲幅 = (d[-1].close - d[-6].close) / d[-6].close × 100
```

**篩選條件（全部符合才進入候選）：**
- 5 日漲幅 ≥ 5%
- 不在 3 日去重名單內

---

### Step 4：取市值，排序，最多 3 支

```
GET http://localhost:8000/stock/{ticker}
```

取 `market_cap`，確認 > 10B（100 億美元），避免低市值雜訊。

按 5 日漲幅由高到低排序，**取前 3 支**。

若候選 < 3 支，全數輸出，不補充。
若 0 支，輸出「本次掃描無符合條件標的」並停止。

---

### Step 5：搜尋每支股票的飆升原因

對每支候選 ticker，取新聞：

```
GET http://localhost:8000/stock/{ticker}/news
```

若 API 無結果，改用：

```
WebSearch："{ticker} stock surge reason site:reuters.com OR site:bloomberg.com OR site:cnbc.com"
```

**限制：** 每支股票最多 1 次 WebSearch，找不到填「新聞未找到」。

---

### Step 6：產出掃描報告

每支股票輸出 **200–300 字**，格式如下：

```
## {TICKER}｜{公司全名}｜+{5日漲幅}%（5日）

**現價：** ${price}　**市值：** ${market_cap}B　**今日漲跌：** {今日%}

**背景脈絡：**
[1-2 句說明這家公司在供應鏈或產業中的定位，
 幫助快速判斷這是個股事件還是產業訊號。]

**飆升原因：**
[2-3 句說明：公司做了什麼、發生了什麼事件，才導致這波上漲。
 事實性描述，不做預測，不加主觀判斷詞（「強勢」「看好」）。]

**注意事項：**
[若有明確風險（法說前後、財報前後、軋空跡象），一句說明；無則省略此段。]
```

多支股票之間用 `---` 分隔。

---

### Step 7：存檔

**對話中輸出完整報告後**，執行以下兩個動作：

**7a. 存掃描報告：**

路徑：`data/scanner/YYYY-MM-DD.md`（今日台灣日期）

若當日已有檔案，**在檔案末尾追加**，加上時間戳記 `## [HH:MM] 第N次掃描`，不覆蓋。

**7b. 更新去重記錄：**

讀取 `data/scanner/seen.json`，將本次輸出的每支 ticker 寫入（或更新）為今日日期，然後**清除超過 7 天的舊記錄**。

---

## 規則

- 只描述事實，不做買賣建議
- 200–300 字的上限是硬性限制，超出就壓縮「背景脈絡」段
- 若同一天執行多次，seen.json 不會讓同一支出現兩次
- 若 us-stock server（localhost:8000）無法連線，立即說明並停止，不嘗試替代資料源
- 掃描完成後不推部落格、不推 GitHub
