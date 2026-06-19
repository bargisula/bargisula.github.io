# AI 半導體與基礎設施 論點追蹤｜建立於 2026-06-09

---

## 當前論點 v1

**一句話論點：** AI 訓練與推論的算力需求是本輪科技週期最確定的長期增量，GPU 軟體生態護城河（NVIDIA）與 hyperscaler 自研 ASIC 週期（Broadcom）共同構成雙引擎，短期出口管制和份額競爭是雜音，四大雲端業者 6,900 億美元的 capex 鎖定了未來 2–3 年的能見度。

**建立日期：** 2026-06-09
**上次更新：** 2026-06-09
**建立背景：** Regime 明確列入 focus_sectors（AI_infrastructure），四個 company bible（NVDA/AVGO/AMD/QCOM）已建立。AVGO Q2 FY2026 財報（2026-06-09 分析）顯示論點顯著強化：Anthropic + OpenAI 新客戶多年合約落地，AI 訂單積壓 300 億美元。

---

## 產業結構速覽

```
訓練端（GPU 主導）
  NVIDIA Blackwell（H100 → B100 → Vera Rubin）← 事實壟斷
  AMD MI350x                                  ← 挑戰者，份額 <10%

推論端（ASIC 加速）
  Google TPU v7（Broadcom 製造）
  Meta MTIA（Broadcom 製造）
  Amazon Trainium 2（Annapurna / AVGO）
  Anthropic / OpenAI（Broadcom 新客戶）       ← 2026 H2 出貨

晶片設計工具
  QCOM（端側 AI / 行動 NPU）
  MRVL（資料中心 ASIC、光互連）
```

**論點核心在 NVDA（訓練壟斷）+ AVGO（ASIC 生態系擴張）**：
兩者定位互補，不是替代關係——NVIDIA 贏訓練端，Broadcom 贏推論端客製需求。

---

## 支撐條件（Conditions to Hold）

> 規則：每條必須是「可以被新聞/財報資料回答的問題」，不能是感覺

| ID | 條件 | 狀態 | 上次檢查 | 備注 |
|---|---|---|---|---|
| C1 | 四大 hyperscaler（MSFT/AMZN/GOOG/META）2026 年合計 AI capex 指引維持或上修 | ✅ 成立 | 2026-06-09 | 合計指引 6,900–7,200 億美元，YoY +36%；全部維持或上調 |
| C2 | NVIDIA 資料中心營收 QoQ 成長率連續兩季 ≥ 10% | ✅ 成立 | 2026-06-09 | Q1 FY2027 資料中心 752 億，QoQ +20%；Q2 指引 910 億，持續加速 |
| C3 | Broadcom AI 半導體營收 QoQ 持續成長，FY2026 全年指引維持或上修 | ✅ 成立 | 2026-06-09 | Q2 AI 108 億（+143% YoY）；Q3 指引 160 億（+48% QoQ）；FY2026 全年 560 億 |
| C4 | Broadcom ASIC 客戶擴張：新客戶確認且既有客戶合約未終止 | ✅ 成立（強化）| 2026-06-09 | Anthropic 6GW 多年合約（2026 H2 出貨）、OpenAI 10GW 框架（2027 起）；Google/Meta 長期協議維持 |
| C5 | CUDA 生態系仍是 AI 訓練主流，無替代框架被頂尖實驗室大規模採用 | ✅ 成立 | 2026-06-09 | 無替代框架大規模採用證據；華為 Ascend 950 限於中國封閉生態 |

**裁定規則：**
- C1 + C2 同時成立 → NVIDIA 論點完整成立
- C3 + C4 同時成立 → Broadcom 論點完整成立
- 任一出現 ⚠️ → 對應個股論點弱化，需追蹤法說
- 任一出現 ❌ → 評估是否需要重寫對應個股論點

---

## 否定條件（Kill Switches）

> 規則：具體事件，不是趨勢。「若 X 發生，論點立即失效」

| ID | 若此發生，論點立即失效 | 狀態 | 上次檢查 |
|---|---|---|---|
| K1 | 兩家以上 hyperscaler 宣布削減 2026 AI capex 指引 ≥ 20% | 未觸發 | 2026-06-09 |
| K2 | AMD MI 系列在 MSFT/GOOG/AMZN AI 訓練晶片佔比超過 25%（連續兩季確認）| 未觸發 | 2026-06-09 |
| K3 | NVIDIA 連續兩季 Guidance 低於市場預期 10% 以上（需求週期反轉信號）| 未觸發 | 2026-06-09 |
| K4 | Google 或 Meta 宣布終止與 Broadcom 的 ASIC 合作，轉向自研或競爭者 | 未觸發 | 2026-06-09 |
| K5 | 美國對 NVDA/AVGO 出口管制擴大至盟國市場，且無新合規方案（60 天內）| 未觸發 | 2026-06-09 |

---

## 標的優先序

| 優先序 | 標的 | 核心邏輯 | 主要風險 |
|---|---|---|---|
| 1 | **NVDA（NVIDIA）** | 訓練端事實壟斷，CUDA 軟體護城河，Blackwell → Vera Rubin 產品週期清晰 | 估值偏高；中國市場永久失去（約 171 億美元/年）；AMD 潛在份額侵蝕 |
| 2 | **AVGO（Broadcom）** | 推論端 ASIC 最大受益者，Anthropic/OpenAI 新客戶確認，VMware FCF 護底 | 毛利率 Q3 指引 74%（低於 Q2 的 77.1%），管理層解釋為 mix 效應 |
| 3 | **MRVL（Marvell）** | ASIC 設計 + 資料中心光互連，受益 hyperscaler 採購多元化 | 規模小於 AVGO，客戶集中度較高 |
| 觀察 | **AMD** | 潛在 NVIDIA 份額挑戰者，ROCm 生態持續改善 | 目前份額仍低，CUDA 護城河短期難以突破 |
| 觀察 | **QCOM** | 端側 AI（手機 NPU）領先，但資料中心 AI 非主戰場 | 手機換機週期不確定；AI PC 市場形成需時間 |

---

## 關鍵驗證事件行事曆

| 日期 | 事件 | 觀察重點 |
|---|---|---|
| 2026-08 | NVDA Q2 FY2027 法說 | 資料中心 QoQ 成長率；Vera Rubin 出貨時間軸；AMD 份額提及 |
| 2026-09 | AVGO Q3 FY2026 法說 | 毛利率是否回升（74% → ？）；Anthropic/OpenAI 出貨確認 |
| 2026-Q3 | Hyperscaler 財報 | capex 指引是否再上調（K1 檢核）|
| 持續 | AMD MI 系列滲透率 | 三大 hyperscaler 的 AMD 採購公告（K2 監控）|
| 持續 | 出口管制動態 | 是否擴大至盟國市場（K5 監控）|

---

## DSMM 座標

依據 RUN-20260607-10Y480 + RUN-20260607-TARIFF：

- **高利率場景**：AI capex 鏈「中性（相對抗跌）」，資料中心投資為長期合約鎖定，不受短端利率直接影響 → 論點維持
- **關稅場景**：NVDA/AVGO 晶片製造以台灣/美國為主，關稅暴露有限；出口管制是更大的制度性風險 → 論點維持
- **Regime 壓力方向**：Overheat → Stagflation 邊界對高估值科技股有估值壓縮壓力，但 earnings 持續超預期可部分對沖；核心論點基於 earnings 成長，非估值擴張

---

## 論點版本歷史

| 版本 | 日期 | 觸發事件 | 裁定 | 核心變化 |
|---|---|---|---|---|
| v1 | 2026-06-09 | 補建 position 檔；AVGO Q2 FY2026 財報分析完成 | 論點成立 | 初始建立；C4 大幅強化（Anthropic/OpenAI 新客戶確認）|
| v2 | 2026-06-19 | AVGO 跨季論點追蹤（Q1 FY2025 → Q2 FY2026 五季）| 論點維持（偏強化）| 「chips only」聲明為語義澄清非撤退；毛利率下移為結構性趨勢（74% Q3 指引）；Apollo/Blackstone 20GW 平台降低訂單取消風險；OB-1 + OB-2 新增觀察點 |

---

## 檢核紀錄

### 2026-06-09 初始建立（含 AVGO Q2 財報）

**觸發原因：** earnings-analyst 執行 AVGO Q2 FY2026 分析後標記「無對應 position 檔」，補建

**條件檢核結果：**
- C1 ✅：四大 hyperscaler 2026 capex 指引全部維持或上調，合計 6,900–7,200 億美元
- C2 ✅：NVDA Q2 FY2027 指引 910 億美元，超預期；Blackwell 需求強勁
- C3 ✅：AVGO Q3 AI 指引 160 億（QoQ +48%）；FY2026 全年 560 億維持
- C4 ✅（強化）：Anthropic 6GW 多年合約（2026 H2 出貨）、OpenAI 10GW 框架（2027 起）——均來自電話會議逐字稿，財報數字看不到
- C5 ✅：無替代框架大規模採用證據

**Kill Switch 狀態：** K1–K5 全部未觸發

**裁定：** 論點成立。C4 大幅強化為本次最重要更新——Broadcom 的 ASIC 客戶從 Google/Meta 擴展至 Anthropic/OpenAI，代表 ASIC 市場規模估算需要大幅上修。

**Opportunity Signal 影響：** AI_infrastructure score 維持 4/5；C4 強化可考慮升至 5/5，但 C3 毛利率下滑需觀察，暫維持 4
