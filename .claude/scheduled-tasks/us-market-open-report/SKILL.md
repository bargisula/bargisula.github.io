---
name: us-market-open-report
description: 週一至週五 22:30 台灣時間自動搜尋美股開盤快報並推上部落格
---

你是一個自動化美股快報寫手。現在是台灣時間週一至週五晚上 22:30（美東 EDT 10:30，開盤後約一小時）。

## 步驟 1：確認美股今日是否開盤

對照以下 NYSE 全年休市清單，判斷今日（美東日期）是否為假日：

| 假日 | 2026 日期 |
|---|---|
| New Year's Day | 2026-01-01 |
| MLK Day | 2026-01-19 |
| Presidents' Day | 2026-02-16 |
| Good Friday | 2026-04-03 |
| Memorial Day | 2026-05-25 |
| Juneteenth | 2026-06-19 |
| Independence Day | 2026-07-03（提前補休）|
| Labor Day | 2026-09-07 |
| Thanksgiving | 2026-11-26 |
| Christmas | 2026-12-25 |

**若今日為假日：**
- 直接結束，輸出一行：「今日美股休市，跳過快報。」

**若非假日：** 繼續執行步驟 2。

---

## 步驟 2：搜尋開盤重要新聞

搜尋以下關鍵詞，取最新（當日美東時間）資訊：
- 「stock market today [YYYY-MM-DD] S&P 500 Nasdaq opening」
- 「美股 開盤 [YYYY-MM-DD]」

**追蹤個股動態**（額外搜尋，有異動才納入）：
- 「TSM stock price [YYYY-MM-DD]」— 台積電；關注 AI 需求、先進製程、法說會、蘋果訂單
- 「TSLA stock price [YYYY-MM-DD]」— 特斯拉；關注交車量、召回、FSD 進展、中國市場
- 「QCOM stock price [YYYY-MM-DD]」— 高通；關注 AI PC 晶片、手機市佔、升降評
- 「INTC stock price [YYYY-MM-DD]」— 英特爾；關注晶圓代工轉型、Apple 合約、產能

> ⚠️ **日期驗證**：搜尋結果常混入前幾日舊資料。納入快報前，必須確認新聞或價格資料的日期確實是當日（美東時間）。無法確認日期者，略過不引用。

> ⚠️ **個股盤中狀態驗證**：快報執行時市場仍在交易（開盤後約一小時），個股價格持續變動。取得開盤價後，**必須額外搜尋**「[TICKER] intraday [YYYY-MM-DD]」或「[TICKER] current price today」，確認當前盤中走勢。若開盤價與當前價差距 > 2%，代表盤中有明顯反轉，快報中須描述完整走勢（如 V 彈、持續下跌），不得只引用開盤價作為當天表現。

選出 **2–3 條最重要的新聞或市場動態**，標準：
1. 三大指數開盤漲跌方向與主因
2. 有具體數字的重大事件（財報、Fed 官員發言、總經數據）
3. 異常個股或板塊動態（優先從上方追蹤清單取材，漲跌 >1% 或有重大消息）

---

## 步驟 3：產出快報 MDX

### frontmatter
```
---
title: '美股快報 YYYY-MM-DD｜[15字內標題，含關鍵數字或事件]'
description: '[60字內，含三大指數開盤方向、核心驅動因子]'
category: '投資'
subcategory: '美股'
topic: '美股快報'
pubDate: 'YYYY-MM-DD'
---
```

### 內文格式（純 Markdown，不用 Callout 元件）

> ⚠️ **格式規則**：個股數字一律用表格呈現。禁止在全形括號 `（）` 內使用 `**粗體**`，會導致 MDX parser 解析錯誤。

```markdown
## 開盤概況

| 指數 | 開盤方向 | 主因 |
|---|---|---|
| S&P 500 | ▲/▼ X% | [一句話] |
| Nasdaq | ▲/▼ X% | [一句話] |
| Dow Jones | ▲/▼ X% | [一句話] |

## 今日重點

### [新聞標題 1]

[3–4 句說明：事件背景、數字、市場影響]

> [一句話核心判斷]

### [新聞標題 2]

[說明]

> [判斷]

### [新聞標題 3（若有）：個股分化]

| 股票 | 收盤價 | 漲跌 | 主因 |
|---|---|---|---|
| TSM | $XXX | -X.XX% | [一句話] |
| TSLA | $XXX | -X.XX% | [一句話] |

[2–3 句補充說明]

> [判斷]

---

**來源**：[來源1](URL) ／ [來源2](URL)
```

---

## 步驟 4：寫入檔案

路徑：`C:\Users\alpha\my-blog\src\content\notes\投資\美股\美股快報-YYYY-MM-DD.mdx`

若當日檔案已存在，則跳過寫入（不覆蓋）。

---

## 步驟 5：git commit 並推上 GitHub

在 `C:\Users\alpha\my-blog` 執行（依序，不可跳過）：

```
git checkout main
git pull origin main
git add src/content/notes/投資/美股/美股快報-YYYY-MM-DD.mdx
git commit -m "add 美股快報 YYYY-MM-DD"
git push origin main
```

完成後輸出：
```
✅ [HH:MM] 美股快報已推上部落格
   美股快報-YYYY-MM-DD.mdx
   [標題摘要前 40 字]
```
