# /stock-pick：個股研究

**用法：** `/stock-pick [TICKER]` 或 `/stock-pick`（不指定則由研究員主動選）

每週產出 1-2 篇個股研究。深入分析，論點優先——先說「為什麼這家公司值得關注，為什麼是現在」，再用基本面和消息面支撐。對外發布，推部落格。

---

## 設計原則

**不是這樣寫：**
> NVDA 本週漲 5%，因為財報超預期，EPS 1.87 優於預期 1.76，資料中心營收 752 億，Q2 指引 910 億。

**要這樣寫：**
> NVDA 的故事從來不是「這季賺多少」——是超大雲端客戶對 GB200 的需求是否超過他們公開承認的數字。Q2 910 億指引的背後，是微軟、Google、Meta 同步宣布今年 capex 不縮，這才是這次財報真正要讀的訊號。

論點是衣架，數據是衣服。沒有衣架，衣服只是一堆布。

---

## 執行步驟

### Step 1：選定標的

**若指定 TICKER：** 直接進 Step 2。

**若未指定：** 從以下來源選出本週最值得深挖的 1 支：
- `data/coverage/ai-chips/` 四檔核心持倉（NVDA/AMD/AVGO/QCOM）的近況
- `data/coverage/supply-chain/watchlist.json` 中有新觸發訊號的公司
- WebSearch：本週有重大消息、財報或產品更新的科技股

選定後說明選題理由（1句話），進 Step 2。

---

### Step 2：建立論點

在蒐集任何數據之前，先回答三個問題：

1. **這家公司的核心護城河是什麼？**（不能只說「技術領先」，要說具體是什麼讓對手難以複製）
2. **現在進入的理由是什麼？**（時機性：為什麼是本週，不是三個月前或三個月後）
3. **什麼條件成立，論點才成立？**（Kill switch：如果 X 不成真，整個邏輯就垮掉）

這三個答案寫出來就是報告的骨架。

---

### Step 3：蒐集支撐數據

依論點需要，抓取：

**基本面（優先 SEC EDGAR 或公司 IR 頁面）：**
- 最近一季或年度：營收成長率、毛利率、自由現金流
- 估值：P/E 或 P/S（與歷史均值和同業比較）

**消息面（WebSearch）：**
- 本週或近期最重要的 1-2 則新聞
- 分析師評等異動（若有）

**若標的在 supply-chain 知識庫：** 讀取對應 `data/coverage/supply-chain/{TICKER}.md`，取 triggers 和 downstream 受益邏輯。

---

### Step 4：撰寫個股研究

**總字數 600-900 字**，格式如下：

```
# 【個股研究】{TICKER}｜{公司名}
{今日日期}

## 論點

> {一句話：這家公司為什麼值得關注，為什麼是現在。這句話必須有時間性，不能是永遠成立的廢話}

{3-4句展開：核心護城河是什麼 + 現在的時機性在哪裡 + 這個邏輯還沒被充分定價的原因}

---

## 基本面快照

| 指標 | 數值 | 與同業/歷史比較 |
|---|---|---|
| 營收成長（YoY） | {%} | {高於/低於/接近} |
| 毛利率 | {%} | {與護城河論點的關係} |
| 自由現金流 | {數字} | {說明趨勢} |
| 估值（P/E 或 P/S） | {倍數} | {貴/合理/便宜，一句說明} |

**基本面小結：** {1-2句：數字和論點是否一致，有無警訊}

---

## 近期催化劑

{1-2 則近期新聞或事件，每則 2-3 句：
- 發生了什麼
- 為什麼這件事強化（或挑戰）了上面的論點}

---

## 論點成立條件

若以下條件不成立，本論點失效：

- {Kill switch 1：具體且可觀測的條件}
- {Kill switch 2}

---

## 下一個確認點

**{具體事件或數據} 預計 {日期}**
{若結果是 X，論點強化；若結果是 Y，重新評估}
```

---

### Step 5：存檔並推部落格

**5a. 存內部記錄：**
路徑：`data/scanner/pick-YYYY-MM-DD-{TICKER}.md`

**5b. 推部落格：**
路徑：`src/content/notes/Xompass/投資報告/pick-YYYY-MM-DD-{TICKER}.md`

Frontmatter：
```yaml
---
title: '【個股研究】{TICKER}｜{5字以內的論點核心}'
description: '{論點一句話，40字以內}'
category: 'Xompass'
subcategory: '投資報告'
topic: '個股研究'
pubDate: 'YYYY-MM-DD'
---
```

---

### Step 6：寫入追蹤記錄

報告發布後，立即更新 `data/tracking/picks.json`：

1. 讀取現有 `picks.json`
2. 新增一筆 entry：

```json
{
  "id": "pick-YYYY-MM-DD-{TICKER}",
  "ticker": "{TICKER}",
  "company": "{公司全名}",
  "recommended_date": "YYYY-MM-DD",
  "price_at_rec": {當時股價，從 Step 3 取得},
  "thesis": "{論點一句話}",
  "entry_condition": "{進場條件，來自論點成立條件}",
  "report_path": "src/content/notes/Xompass/投資報告/pick-YYYY-MM-DD-{TICKER}.md",
  "reviews": {
    "week1": { "due": "{+7天日期}", "price": null, "direction": null, "thesis_status": null, "notes": null },
    "week2": { "due": "{+14天日期}", "price": null, "direction": null, "thesis_status": null, "notes": null },
    "week3": { "due": "{+21天日期}", "price": null, "direction": null, "thesis_status": null, "notes": null }
  },
  "final_verdict": null,
  "failure_mode": null,
  "status": "pending"
}
```

3. 更新 `stats.total`（+1）、`stats.pending`（+1）、`stats.last_updated`
4. 寫回 `picks.json`

---

## 規則

- **論點必須有時間性**：「NVDA 是好公司」不是論點；「NVDA 的中國失去部分已被定價，但 GB200 拉動的 CoWoS 需求尚未」才是論點
- **基本面服務論點**：只放和論點直接相關的數字，不求完整財務報表
- **Kill switch 必須可觀測**：「若市場環境惡化」不是 kill switch；「若 NVDA Q2 毛利率跌破 70%」才是
- 不做買賣建議，不預測股價
- 一次最多 2 支，不求多
