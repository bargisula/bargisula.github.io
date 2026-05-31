# /jade-report：璞玉報告

**用法：** `/jade-report [事件描述或新聞標題]`

產業大事件觸發時，自動查詢供應鏈知識庫，找出 2-3 個間接受益的「璞玉」標的，產出原創分析報告。報告為內部閱讀用，不推部落格。

---

## 執行步驟

### Step 1：讀取 Regime Config

讀取 `data/regime/current.json`，取得：
- 當前 regime 名稱與描述
- `focus_sectors`：當前聚焦產業
- `trigger_keywords`：當前觸發關鍵詞

### Step 2：判斷事件是否在 Regime 範圍內

對照使用者輸入的事件，與 `trigger_keywords` 和 `focus_sectors` 比對：

- **命中 ≥1 個關鍵詞或產業**：繼續執行
- **完全不命中**：輸出「本事件與當前 Regime（{regime名稱}）聚焦方向不符，建議 CMO 評估是否更新 Regime Config」，然後詢問是否仍要繼續

### Step 2b：讀取產業結論 JSON（若存在）

根據事件涉及的產業，嘗試讀取 `data/industry/{slug}.json`：

- 若存在且 `verdict` 有值 → 直接沿用此產業的 `top_candidates` 與 `kill_switches` 作為選標的的優先依據
- 若存在但 `verdict = avoid` → 標注 ⚠️「當前產業結論為迴避，確認供應鏈連結邏輯充分後再繼續」
- 若不存在 → 跳過此步，依照 watchlist 自行判斷

**不重新推導產業結論，只讀取現有裁定。**

---

### Step 3：讀取 Watchlist，選定相關公司

讀取 `data/coverage/supply-chain/watchlist.json`，取出所有 `status: "active"` 的公司。

根據事件內容，判斷哪 2-3 家最可能間接受益：
- 對照每家公司的 `add_reason` 做初步過濾
- 優先選供應鏈連結明確（非僅主題相關）的公司

### Step 4：讀取知識庫（讀取 Agent 職能）

對 Step 3 選定的每家公司，讀取：
```
data/coverage/supply-chain/{TICKER}.md
```

萃取：`downstream.D1`、`downstream.D2`、`triggers`、`substitution_risk`

這一步取代重複讀檔，只讀選定的 2-3 家。

### Step 5：撰寫璞玉報告

輸出以下格式，**總字數 600-900 字**：

```
# 【璞玉】{事件標題} → {受益公司 Ticker1 / Ticker2}
{今日日期}

## 事件
{2-3 句描述事件本身：發生了什麼、誰宣佈、數字是多少。不加評論。}

## 供應鏈連結

### {TICKER1}｜{公司名}
**定位：** {這家公司在供應鏈的層次，一句話}
**連結邏輯：** {事件 → 哪個業務部門 → 為什麼受益，2-3句，要有具體數字或合約依據}
**觸發條件是否命中：** {對照 md 中的璞玉觸發條件，說明本事件命中哪一條}

### {TICKER2}｜{公司名}
（同上格式）

### {TICKER3}｜{公司名}（若有第三家）
（同上格式）

## 反向風險
{1-2 個讓上述邏輯失效的條件，簡短列點}

## 與 Regime 的關係
{一句話說明本事件如何強化或修正當前 Regime（{regime名稱}）的敘事}
```

### Step 6：存檔

路徑：`data/scanner/jade-{YYYY-MM-DD}-{TICKER1}.md`

若同日已有同 ticker 的璞玉報告，在檔名加 `-2`，不覆蓋。

---

## 規則

- **連結邏輯必須有供應鏈依據**，不能只說「AI 趨勢受益」——要說到具體業務部門、客戶或產品
- 選不出 2 家有明確連結的公司時，寧可只輸出 1 家，不硬湊
- 若知識庫內無相關公司，輸出「知識庫尚未覆蓋此事件的直接受益層，建議新增：{建議 ticker}」
- 不做買賣建議，不預測股價
- 報告為內部閱讀，不推部落格、不推 GitHub
