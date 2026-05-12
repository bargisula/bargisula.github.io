---
name: macro-scan
description: >
  總體經濟掃描框架。當使用者說「總經掃描」「這週有什麼數據」「總經環境」
  「macro」「市場現在是 risk-on 還是 risk-off」時，
  搜尋當週重要總經指標與事件，輸出一頁式總覽，判斷當前市場模式。
  不自動寫檔，對話中輸出後詢問是否儲存。
user-invocable: true
---

# 總體經濟掃描 SKILL

## 執行流程

```
搜尋四個面向數據 → 輸出一頁式總覽 → 判斷 risk-on/off → 詢問是否存檔
```

---

## 步驟 1：取得今日日期與本週範圍

- 今日：YYYY-MM-DD
- 本週：週一 YYYY-MM-DD ～ 週五 YYYY-MM-DD

---

## 步驟 2：並行搜尋四個面向

### 面向 A｜Fed 與利率

搜尋：
- 「Fed FOMC meeting schedule 2026」
- 「US 10 year treasury yield [今日日期]」
- 「Fed funds rate current 2026」

取得：
- 下次 FOMC 會議日期（距今幾天）
- 目前聯邦基金利率
- 10Y 殖利率當前水位
- 市場對下次會議的降息機率（CME FedWatch）

---

### 面向 B｜本週重要數據行事曆

搜尋：
- 「economic calendar this week [本週日期範圍] US」
- 「CPI NFP GDP PCE release date 2026」

取得本週預計發布的關鍵數據（有則列，無則略）：

| 數據 | 發布日 | 上次值 | 市場預期 |
|---|---|---|---|
| CPI | | | |
| 核心 PCE | | | |
| 非農就業（NFP） | | | |
| GDP | | | |
| 初領失業金 | | | |
| Fed 官員發言 | | | |

---

### 面向 C｜市場情緒指標

搜尋：
- 「VIX index current [今日日期]」
- 「DXY US dollar index [今日日期]」
- 「S&P 500 current level [今日日期]」
- 「gold price [今日日期]」

取得：

| 指標 | 當前值 | 方向 | 意涵 |
|---|---|---|---|
| VIX | | ▲/▼ | <20 低恐慌 / 20-30 警戒 / >30 恐慌 |
| DXY | | ▲/▼ | 強美元壓新興市場與原物料 |
| S&P 500 | | ▲/▼ | 距離前高 / 前低幾% |
| 黃金 | | ▲/▼ | 避險需求指標 |
| 10Y 殖利率 | | ▲/▼ | 高殖率壓估值 |

---

### 面向 D｜本週重大事件

搜尋：
- 「major earnings this week [本週日期] S&P 500」
- 「geopolitical risk market [今日日期]」

取得：
- 本週重要財報（S&P 500 成分股）
- 需要關注的地緣政治或政策事件

---

## 步驟 3：輸出一頁式總覽

格式：

```
## 總體掃描｜[YYYY-MM-DD] 週

### Fed & 利率
- 目前利率：X.XX%
- 下次 FOMC：YYYY-MM-DD（距今 N 天）
- 降息機率：本次 X%，年底前累計 X%
- 10Y 殖利率：X.XX%（▲/▼ X bp 週比）

---

### 本週數據行事曆

| 數據 | 日期 | 預期 | 上次 |
|---|---|---|---|

---

### 市場情緒儀表板

| 指標 | 數值 | 訊號 |
|---|---|---|
| VIX | XX | 🟢低恐慌 / 🟡警戒 / 🔴恐慌 |
| DXY | XXX.X | 強/弱美元 |
| S&P 500 | X,XXX | 距前高 ±X% |
| 黃金 | $X,XXX | 避險需求 高/低 |
| 10Y 殖利率 | X.XX% | 高壓/中性/寬鬆 |

---

### 本週重要財報

| 公司 | 日期 | 預期 EPS |
|---|---|---|

---

### 本週風險事件

- [事件 1]
- [事件 2]

---

### 市場模式判斷

> [一句話：現在是 risk-on（追成長）、risk-off（守防禦）、還是 wait-and-see（等數據）]

**核心邏輯**：[2-3 句說明為什麼這樣判斷，依據是哪幾個指標]
```

---

## 步驟 4：詢問儲存

輸出後加上：

```
─────────────────────────────
要存起來嗎？

A) 存成週報筆記 → notes/投資/總經/總經掃描-YYYY-MM-DD.md
B) 不用，看完就好
─────────────────────────────
```

### 若選 A，寫檔並推上 GitHub

路徑：`C:\Users\alpha\my-blog\src\content\notes\投資\總經\總經掃描-YYYY-MM-DD.md`

frontmatter：
```yaml
---
title: '總經掃描 YYYY-MM-DD｜[市場模式判斷，10字內]'
description: '[60字內，含 VIX 水位、殖利率、本週關鍵數據]'
category: '投資'
subcategory: '總經'
pubDate: 'YYYY-MM-DD'
draft: true
---
```

git：
```
git checkout main
git pull origin main
git add src/content/notes/投資/總經/總經掃描-YYYY-MM-DD.md
git commit -m "add 總經掃描 YYYY-MM-DD"
git push origin main
```

---

## 觸發範例

- 「總經掃描」
- 「這週有什麼數據」
- 「總體環境怎麼樣」
- 「現在 risk-on 還是 risk-off」
- 「macro」
