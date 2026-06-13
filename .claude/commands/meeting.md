# /meeting：晨會

目標：**今天要不要改變判斷。**

資訊是原料。晨報的產品是：世界觀有沒有被今天的市場偷襲。

---

## 後台執行（並行，不等待，不輸出）

同時啟動，結果只用於合成晨報，不單獨呈現：

- 讀取 `data/meetings/` 最新一份（上次裁定與追蹤事項）
- 讀取 `data/insights/insights.json`（所有 active Insight）
- 讀取 `data/tracking/picks.json` + `data/tracking/watchlist.json`
- 讀取 `data/regime/current.json`
- 讀取 `data/dsmm/macro-to-stock.json`——若有 TC 觸發，查對應 ticker 的 net_force_framework 現況評估
- 讀取 `data/dsmm/verification/*.json`——掃描所有 VCP，篩出 `check_date ≤ 今日 AND verdict == null` 的逾期項目
- 讀取 `data/industry/verification/*.json`——同上，掃描產業 VCP 逾期項目
- `dni` agent：今日新聞，優先讀 `data/intel/` 快取
- `secretary` agent：行事曆到期項目
- `market-data` agent（美股 + 台股）：最近收盤日數字
- `/jade-scan`：掃描 EDGAR 最新 8-K，產生璞玉候選至 `data/jade/inbox/`（背景執行，不等待，Step 3 時讀取結果）

---

## 晨報輸出格式

輸出一份，標題：`# Xompass 晨報｜YYYY-MM-DD`

---

### 1. 前次追蹤

> 讀取最新會議紀錄，取「今日裁定」與「待追蹤」段落。並掃描 DSMM / 產業 VCP 逾期項目（後台已讀入）。

表格格式，每項一行：

| 追蹤事項 | 預計日期 | 今日狀態 | 結果 |
|---|---|---|---|
| {上次說要等什麼} | {日期} | ✅ 觸發 / ⏳ 未到 / ❌ 未執行 | {數值或說明} |

**VCP 逾期自動列入：** 若後台掃描到 `check_date ≤ 今日 AND verdict == null` 的 VCP，自動追加至追蹤表，標記 `⚠️ 逾期待驗`，格式：

| VCP-XXX（DSMM/産業） | check_date | ⚠️ 逾期待驗 | 建議：`/dsmm-verify {run_id}` 或 `/industry-verify {run_id}` |

若上次無待追蹤事項且無逾期 VCP，此節一行：「上次無待追蹤事項，無逾期 VCP。」

---

### 2. 市場環境

> 整合 market-data、dni、secretary、regime 四路資料，以敘事方式呈現，不是列表堆砌。

**寫法原則：** 先說大盤方向（一句話定調），再說關鍵數字，再說今日有哪些重要新聞或數據事件，最後一句話說當前 Regime 與風險姿態（Risk-on / Neutral / Risk-off）。整節不超過 200 字。

結構順序：
1. 美股最近收盤（三大指數漲跌、VIX、10Y 殖利率、SOX）
2. 台股最近收盤（加權指數、外資買賣超、台積電）
3. 今日已知事件（財報、數據發布、FOMC 相關）
4. Regime 與風險姿態——**不寫在敘事段落內，單獨用以下格式收尾：**

```
Regime：{名稱}　姿態：{Risk-on / Neutral / Risk-off}
尾部風險：若 {具體觸發事件}，則 {具體後果}
```

Regime 名稱直接從 `data/regime/current.json` 讀取，不自行造詞。
尾部風險必須是「若 X 則 Y」格式，不寫成現況描述。

---

### 3. 今日議題

> 這是晨報的核心節。從前兩節的數據與新聞中，**自動識別**需要討論或裁定的問題，不要等董事長問。

每個議題格式：

```
【議題一】{議題標題}
背景：{一句話說為什麼這是今天的問題}
關鍵問題：{需要回答什麼才能裁定}
影響：{INS-XXX / TICKER / Regime}
建議討論深度：{快速確認 / 需深挖（調度 agent）}
```

議題數量：2-4 個。過濾標準：**接不上 Insight / Pick / Regime / 待追蹤事項的事件不列為議題。**

識別邏輯（自動判斷）：
- 有 Pick 進場條件觸發 → 議題：是否執行建倉
- 有 Insight 被新數據確認或挑戰 → 議題：是否調整 confidence / tier / status
- 有財報或重要數據今日公布 → 議題：結果如何、影響哪條論點
- 有待裁定事項 carry over 超過兩次 → 議題：今日需做 Yes/No
- **`data/jade/inbox/` 有 `status: pending` 的候選檔** → 議題：璞玉候選評估，標題加註「【璞玉候選】」，列出 ticker / 觸發訊號 / 建議動作

**若當日無自然議題（市場平靜、無財報、無新聞命中 Insight，且無璞玉候選）：**
調度 `industry-analyst`，從 `data/knowledge/research-queue.json` 取 priority 最高且 last_analyzed 最舊（或 null）的產業，作為墊檔討論。格式同上，標題加註「【墊檔產業討論】」。不要硬湊假議題，墊檔比空白好、比假議題更好。

---

### 4. 裁定

> 討論完議題後填寫，或若議題明確可直接建議。

```
① {等待 / 加碼 / 減碼 / 觀察 / 執行 / 關閉}：{做什麼 / 等什麼條件 / 不做什麼}
② {同上}
③ {同上}
```

行動動詞開頭。不寫現況描述。

---

### 5. 下次檢查點

```
- {日期}：{事件}——驗證 {什麼問題的答案}
- {日期}：{事件}——驗證 {什麼問題的答案}
```

---

輸出後說：「以上為今日晨報，請董事長確認或提出議題。」等待回應，不主動推進。

---

## 追加討論

董事長提出議題後，CEO 依類型調度：

| 議題 | 調度對象 |
|---|---|
| 個股（NVDA/AMD/AVGO/QCOM） | `ai-infra-researcher` |
| 宏觀 / Regime | `cmo` |
| 供應鏈受益 | `/jade-report [事件]` |
| 產業分析 | `industry-analyst` |
| 財報細節 | `earnings-analyst` |
| 技術前沿 | `cto` |
| 宏觀衝擊推導 | `/dsmm-pipeline [衝擊描述]` |
| DSMM 驗證 | `/dsmm-verify {run_id}` |
| 産業分析啟動 | `/industry-pipeline {産業名稱} [觸發事件]` |
| 産業論點驗證 | `/industry-verify {run_id}` |

深挖結果：結論 2-3 行先說，細節用 `<details>` 折疊。

討論完成後更新第 4 節裁定，直到董事長說「可以」或「寫會議紀錄」。

---

## 會議紀錄

**兩份同步寫入，格式不同：**

1. `data/meetings/YYYY-MM-DD.md`——**內部完整版**（保留所有系統代號、追蹤表格、VCP）
2. `src/content/notes/Xompass/會議記錄/YYYY-MM-DD.md`——**對外簡報版**（白話文，無系統代號，見下方格式）

---

### 內部版（data/meetings/）六個章節

1. 前次追蹤事項
2. 市場環境（美股/台股大盤、重要新聞、總經、Regime）
3. 今日議題（自動生成的結構化議題）
4. 裁定（置頂，行動動詞開頭）
5. 下次檢查點
6. 深入討論（若有）

---

### 對外版（src/content/notes/）格式規範

**Frontmatter：**
```yaml
---
title: '【晨報】YYYY-MM-DD Xompass 投資簡報'
description: '60字內，用白話列出本次主要討論主題，不用系統代號'
category: 'Xompass'
subcategory: '會議記錄'
pubDate: 'YYYY-MM-DD'
---

import Callout from '@components/Callout.astro'
```

**注意：對外版副檔名必須是 `.mdx`，不是 `.md`。**

**四個區塊（固定順序）：**

**① 本週結論**（必填）
- 用**一個** `<Callout type="insight">` 框，內含編號條列（1. 2. 3.）
- 每條格式：`編號. **粗體標題** — 說明文字`
- 結尾另起一個 `<Callout type="warning">` 放風險提示（若有）
- 語言：白話文，不用英文縮寫（SOXX → AI 半導體 ETF）、不用系統代號（INS-001、Kill Switch、Regime）
- Callout 標籤內的條列前後要留空行，確保 markdown 正確渲染

**② 市場快覽**（必填）
- 數字表格保留
- 表格下方加一句敘事定調（1-2 句）
- Regime 改白話：「當前市場環境：XX 期，整體偏多/中性/偏空（Risk-On/Neutral/Off）」
- 尾部風險用「若 X 則 Y」格式，不用技術術語

**③ 本週焦點**（必填）
- 每個討論議題一個 `###` 小節
- 標題用公司中英文名稱，不用代號（GLW → Corning（GLW））
- 移除所有內部術語，改為白話說明
- 每節結尾用 **粗體** 寫一句核心判斷

**④ 產業視角 / 總經觀點**（選填，有才放）
- 有產業分析輸出 → 放「產業視角」節
- 有 DSMM 輸出 → 放「總經觀點」節
- 同樣白話文，不放追蹤表格或 VCP

**不放的東西：**「下次檢查點」表格、追蹤代號、系統狀態更新、「裁定」標題（結論已在 Callout 裡）

---

裁定置頂。確認後才寫，不在討論中途存檔。寫完後 git push origin main（直接 push，不需要 PR）。
