---
name: earnings
description: >
  財報快查框架。當使用者說「看 [TICKER] 財報」「[TICKER] 最新財報」「抓 [TICKER] earnings」
  「[公司] 財報分析」時，直接抓 SEC EDGAR 原始申報文件（美股）或公開資訊觀測站（台股），
  輸出精簡五段分析，不討論架構直接跑，完成後詢問儲存方式。
user-invocable: true
---

# 財報快查 SKILL

## 與 deep-analysis 的差異

| | earnings（本 skill） | deep-analysis |
|---|---|---|
| 觸發 | 「看 NVDA 財報」 | 「深度分析 NVDA」 |
| 資料來源 | SEC EDGAR 原始申報文件 | 泛搜尋 |
| 架構討論 | 不討論，直接跑 | 先討論才動筆 |
| 輸出長度 | 精簡五段，快速 | 六節 2000 字+ |
| 儲存方式 | 完成後由使用者決定 | 固定存深度分析 MDX |

---

## 執行流程

```
收到指令（TICKER 或公司名）
  ↓
步驟 1：判斷股市別（美股 / 台股）
  ↓
步驟 2：抓取財報原始資料
  ↓
步驟 3：輸出五段分析
  ↓
步驟 4：詢問儲存方式
  ↓
步驟 5：依選擇寫檔 + git push（或結束）
```

---

## 步驟 1：判斷股市別

- 英文 ticker（NVDA、TSLA、TSM）→ **美股**，走 SEC EDGAR
- 四位數字（2330、2317）或中文公司名 → **台股**，走公開資訊觀測站
- 若無法判斷，直接問使用者「美股還是台股？」

---

## 步驟 2：抓取財報資料

### 美股（SEC EDGAR）

依序搜尋，取得最新一份 10-Q 或 10-K：

**1. 找最新申報文件連結：**
搜尋：`[TICKER] 10-Q SEC EDGAR 2026` 或 `[TICKER] 10-K SEC EDGAR 2026`

**2. 抓 earnings call transcript：**
搜尋：`[TICKER] earnings call transcript Q[N] 2026 site:seekingalpha.com OR motleyfool.com`

**3. 抓財務摘要數字：**
搜尋：`[TICKER] revenue gross margin EPS Q1 2026 results`

> ⚠️ 所有數字必須來自搜尋結果，不使用訓練資料內的財務數字。找不到寫「未取得」。

### 台股（公開資訊觀測站）

**1. 找財報：**
搜尋：`[股票代號 或 公司名] 財報 2026 公開資訊觀測站` 或
WebFetch: `https://mops.twse.com.tw/mops/web/t05st09_1`

**2. 抓法說會摘要：**
搜尋：`[公司名] 法說會 2026 摘要`

---

## 步驟 3：輸出五段分析

### 格式規則
- 財務數字一律用表格
- 禁止在全形括號 `（）` 內使用 `**粗體**`
- 不使用 Callout 元件（純 Markdown）

---

### 段落一｜基本資訊

| 項目 | 內容 |
|---|---|
| 公司 | [公司名]（[TICKER]） |
| 報告類型 | 10-Q / 10-K / 季報 |
| 報告期間 | [年份] Q[N]，截至 [YYYY-MM-DD] |
| 資料來源 | SEC EDGAR / 公開資訊觀測站 |

---

### 段落二｜財務趨勢（近三季對比）

| 指標 | Q[N-2] | Q[N-1] | Q[N]（最新） | YoY |
|---|---|---|---|---|
| 營收 | $XXB | $XXB | $XXB | +X% |
| 毛利率 | X% | X% | X% | ±X pp |
| 營業利益率 | X% | X% | X% | ±X pp |
| EPS | $X.XX | $X.XX | $X.XX | +X% |

> 找不到的欄位填「未取得」，不硬生成。

---

### 段落三｜Guidance 變化

本季 management 給出的下季展望，與上季 guidance 對比：

| 項目 | 上季 guidance | 本季 guidance | 方向 |
|---|---|---|---|
| 營收區間 | $XXB–$XXB | $XXB–$XXB | ▲ / ▼ / 持平 |
| 毛利率預估 | X% | X% | ▲ / ▼ |
| 關鍵說法變化 | [上季關鍵字] | [本季關鍵字] | [改變方向] |

若無法取得 guidance，寫「本次未發布具體 guidance」。

---

### 段落四｜風險段落異動

10-K 專用（10-Q 可略）：比較本期與上期 Risk Factors 的差異。

- **新增風險**：[列出新增項目]
- **刪除風險**：[列出移除項目]
- **措辭加重**：[原句 → 新句，標出關鍵字變化]

若無法取得原始 Risk Factors，搜尋：`[TICKER] 10-K risk factors changes 2026`

---

### 段落五｜一句話結論

> [一句話：這份財報最重要的訊號是什麼，以及對股價的潛在影響]

---

## 步驟 4：詢問儲存方式

分析完成後，輸出：

```
─────────────────────────────
分析完成。要怎麼處理這份報告？

A) 存成快報 → 發布到部落格（公開）
B) 存成研究筆記 → 存到 notes/投資/研究/（不發布）
C) 不用存，看完就好
─────────────────────────────
```

---

## 步驟 5：依選擇寫檔

### A) 存成快報

**路徑：**
```
src/content/notes/投資/美股/[TICKER]-財報-YYYY-Q[N].mdx
src/content/notes/投資/台股/[股票代號]-財報-YYYY-Q[N].mdx
```

**frontmatter：**
```yaml
---
title: '[TICKER] YYYY Q[N] 財報快查｜[15字內重點]'
description: '[60字內，含關鍵財務變化與 guidance 方向]'
category: '投資'
subcategory: '美股'
topic: '財報分析'
pubDate: 'YYYY-MM-DD'
---
```

### B) 存成研究筆記

**路徑：**
```
src/content/notes/投資/研究/[TICKER]-YYYY-Q[N].md
```

**frontmatter：**
```yaml
---
title: '[TICKER] YYYY Q[N] 財報筆記'
pubDate: 'YYYY-MM-DD'
draft: true
---
```

### C) 不存

直接結束，不做任何 git 操作。

---

## Git 推送（A 或 B 選項）

在 `C:\Users\alpha\my-blog` 執行：

```
git checkout main
git pull origin main
git add [檔案路徑]
git commit -m "add [TICKER] 財報快查 YYYY-Q[N]"
git push origin main
```

---

## 觸發範例

- 「看 NVDA 財報」
- 「TSLA 最新財報」
- 「抓 TSM 10-K」
- 「2330 財報分析」
- 「台積電法說會摘要」
- 「QCOM earnings Q1 2026」
