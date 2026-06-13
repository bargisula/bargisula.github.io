# Brain Project
**Xompass v2：金融因果認知系統升級**

---

## 目標

```
現在：高品質新聞整理 + 研究報告系統
目標：可自我修正的金融因果認知系統
```

核心命題：市場已定價 AI 的 AD 面（Capex 拉動），幾乎沒有定價 AI 的 AS 面（生產力通縮效應）。Xompass 若能比市場早 12-18 個月識別 AD→AS 轉折，這是真實的 alpha 來源。

成功標準：給定任意三個輸入事件，系統能輸出哪些公司受益、哪些論點強化、哪些風險上升，且這個能力隨時間越來越準。

---

## 系統架構（三層）

```
Bible（宏觀世界模型）
  AS-AD 骨架 + Mundell-Fleming 匯率擴散 + Dalio 長債務週期
  → 物價、利率、區域分化的長期路徑

Insight（因果洞察庫）
  結構化因果命題，帶有效期、失效條件、因果類型
  → 站在 Bible 上，推演當前具體情況

Regime（當前定位）
  經濟指標定位當前週期位置
  → 1-2 季解析度，接入 US-STOCK 系統
```

**衝突仲裁協議（三層發生矛盾時）：**
1. 先更新 Regime（更新當前位置，不動世界觀）
2. 再查哪條 Insight 的假設斷了（局部更新）
3. 只有外生變數發生結構性跳躍，才動 Bible（少數情況）

---

## Phase 1｜Schema 升級
> 目標：改好資料結構，為後續建構打基礎
> 工作量：1-3 天

- [ ] **insights.json 加 `tier` 欄位**
  - L1 假說：單次事件，可引用標黃，不納入推演主線
  - L2 洞察：兩次獨立事件支撐，正常使用
  - L3 定律：五次+跨週期驗證，寫入 Bible
  - *解決：冷啟動期 Insight 庫空曠問題*

- [ ] **insights.json 加 `causal_type` 欄位**
  - `physical`：物理世界機制（晶片短缺→交期延遲），穩定
  - `cognitive`：市場認知機制（降息預期→估值擴張），會被提前定價殺死
  - *解決：反身性問題，cognitive 因果設更低的 confidence 上限*

- [ ] **insights.json 加 `regime_dependency` 欄位**
  - 標注該因果在哪些 Regime 下才成立
  - 範例：`["High inflation / Strong Capex"]`
  - *解決：同一因果在 QE 和 Tightening 效果相反的問題*

- [ ] **Regime current.json 加兩個欄位**
  - `bible_anchor`：當前 Bible 核心假設一句話
  - `insight_signal`：Insight 層上一次擴散狀態摘要
  - *目的：三層正式串聯，不再各自獨立*

- [ ] **衝突仲裁協議寫成文件**
  - 存於 `data/brain-project/conflict-protocol.md`
  - 定義三層衝突時的修改優先順序
  - *解決：「先改哪層」的判斷標準*

---

## Phase 2｜晨會流程升級
> 目標：把知識接入每日決策，不靠人記
> 工作量：1 週

- [ ] **晨會 Step -1 改為衝突驅動**
  - 現在：靜態讀 active Insights 摘要
  - 改為：系統比對昨夜新聞與現有 Insights 的衝突，提示需優先討論的項目
  - 格式：「昨夜 PCE 數據與 Insight #001 前提假設不符，偏差超預期，今日優先討論是否觸發失效」
  - *解決：資訊疲勞，讓每日推演圍繞「維護世界觀」而非「複習功課」*

- [ ] **Secretary 掃描邏輯加入 Insight 到期檢查**
  - 現有 watchlist 邏輯 → 同步掃 `expiry_check`
  - 到期前 3 天提報，讓 CEO 決定延期、失效或刪除

- [ ] **審計觸發門檻定義**
  - 只有同時滿足三條件才觸發審計：
    1. 該 Insight 被晨會裁示引用 ≥ 3 次
    2. 實際結果偏離預測 > 2 個標準差
    3. 同類型失效已發生 ≥ 2 次
  - 其他靜默過期，不強制審計
  - *解決：人性摩擦，避免 audit 流於形式*

---

## Phase 3｜Bible 建構
> 目標：建立宏觀世界模型骨架
> 工作量：2-4 週

- [ ] **宏觀 Bible v1：AS-AD 骨架**
  - AI 外生變數路徑：AD 衝擊（2022-2026 Capex 潮）→ AS 衝擊（2027-2029 生產力）
  - 外生變數清單：AI 生產力曲線、美伊衝突、人口、氣候
  - 焦點輸出：物價路徑、實質利率長期均衡
  - 存於 `data/bible/macro-asad.md`

- [ ] **Bible 快慢變數分拆**
  - 慢變數（半年重評）：人口、氣候、地緣結構性變化
  - 快變數（月度快照）：AI 生產力代理指標、地緣衝突強度
  - 快變數更新由 CMO 月報執行

- [ ] **Mundell-Fleming 匯率擴散模板**
  - 當利率發生變動，如何傳導至匯率、資本流動、區域分化
  - 存於 `data/bible/macro-mf.md`

- [ ] **個股 Bible 加 AD/AS 敞口矩陣**
  - 現有：`AD受益 / AS受益` 二元標注
  - 升級：`{AD_短期, AD_中期, AS_長期}` 各打 -1 到 +1
  - 範例：TSMC `{AD_短期: +0.8, AD_中期: +0.3, AS_長期: -0.2}`
  - 覆蓋標的：NVDA、AMD、AVGO、QCOM、TSM、GLW

---

## Phase 4｜Insight 系統運作
> 目標：Insight 庫開始累積、審計機制上路
> 工作量：持續執行

- [ ] **L1 假說冷啟動**
  - 從 2026-05-23、2026-05-25 兩次會議萃取 L1 假說填入庫
  - 目標：前三個月維持 10-15 條 L1，讓晨會有材料用

- [ ] **audit_log.json 格式建立**
  - 欄位：insight_id、audit_date、causal_chain_breakdown（哪節斷）、failure_reason、what_we_missed
  - 存於 `data/insights/audit_log.json`

- [ ] **首次因果審計執行**
  - 當第一條 Insight 到期，執行一次完整審計作為範本
  - CEO 主導，15 分鐘內完成，不寫長文

---

## Phase 5｜先行指標升級
> 目標：追蹤 AI AD→AS 轉折，比市場早 2 個季度
> 工作量：1 週設置，持續追蹤

- [ ] **移除單一指標依賴（印度 IT headcount）**
  - 印度 IT 是同步指標，太慢

- [ ] **新增三個 AS 先行指標進 watchlist**
  - `NVDA 推理晶片 vs 訓練晶片營收佔比`：推理 > 40% 代表 AS 應用端起量（NVDA 季報）
  - `Microsoft/Salesforce 財報電話「seat-based pricing 壓力」提及次數`：QoQ 變化率
  - `美國 H1B 簽證核准率`：連續兩季下滑代表企業預期勞動力需求結構改變

- [ ] **GitHub Copilot 企業席位月增率**
  - 技術滲透率代理指標，月更

---

## Phase 6｜學習機制上路
> 目標：系統開始自我修正，智慧隨時間提升
> 工作量：累積 8-10 次審計後啟動

- [ ] **premise_library.md 第一版**
  - 從前三次因果審計提煉推理前提
  - 格式：`[類型] 前提條件：成立條件 / 已知失效情境`
  - 存於 `data/insights/premise_library.md`

- [ ] **PMC 議程加入失效模式分析**
  - 每月 PMC 加一個固定議程：「上月哪條因果斷了、斷在哪裡、是否有模式」
  - 產出：更新 premise_library

- [ ] **信心校準（10 條審計後）**
  - 統計：confidence 0.7 的 Insight，實際準確率是多少
  - 若系統性偏高/偏低，調整打分基準

- [ ] **偏誤命名（20 條審計後）**
  - 找出 Xompass 系統性錯的方向並明確命名
  - 範例：「我們一直高估政策傳導速度」

---

## 檢查清單彙總

| Phase | 項目數 | 預計工時 | 狀態 |
|---|---|---|---|
| Phase 1 Schema 升級 | 5 項 | 1-3 天 | 待啟動 |
| Phase 2 晨會升級 | 3 項 | 1 週 | 待啟動 |
| Phase 3 Bible 建構 | 4 項 | 2-4 週 | 待啟動 |
| Phase 4 Insight 運作 | 3 項 | 持續 | 雛形已建 |
| Phase 5 先行指標 | 4 項 | 1 週 | 待啟動 |
| Phase 6 學習機制 | 4 項 | 累積後啟動 | 未啟動 |

---

## 立刻可做（不需等待其他 Phase）

```
□ insights.json schema 升級（tier + causal_type + regime_dependency）
□ Regime current.json 加 bible_anchor + insight_signal
□ 衝突仲裁協議文件
□ 三個 AS 先行指標加入 watchlist
□ 晨會 Step -1 改為衝突驅動
```

---

*建立日期：2026-05-25*
*負責人：CEO + 董事長*
*下次檢視：2026-06-25（Phase 1 完成後）*
