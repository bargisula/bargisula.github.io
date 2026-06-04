---
title: '【投資】黃仁勳的「最重要投影片」：AI 代理的 Harness 架構'
description: '黃仁勳在 COMPUTEX 2026 宣示代理式 AI 時代來臨，拆解 Agent = LLM + Harness 四大組件，Harness 扮演 OS 角色協調思考、工具與記憶。Cadence 案例印證速度提升 40 倍。'
category: '投資'
subcategory: '美股'
topic: 'NVIDIA'
pubDate: '2026-06-04'
---

## 核心論點

> **黃仁勳明確宣告：AI 從「生成式」跨入「代理式」。Agent = LLM + Harness，其中 Harness 是讓大腦連接現實世界的「作業系統」，也是這波運算典範轉移的核心差異點。**

來源：INSIDE〈黃仁勳：「這是最重要的一張投影片」AI 代理最需要的 Harness 到底是什麼？〉（2026/06/04）

---

## 一、典範轉移宣言

黃仁勳在 COMPUTEX 2026 演講中的關鍵宣示：

> 「實用的 AI 已經到來（Useful AI has arrived）。」

| 世代 | 特徵 |
|------|------|
| 生成式 AI（過去兩年） | 被動回答問題的聊天機器人 |
| 代理式 AI（現在起） | 能觀察、推理、計畫、執行任務的代理人 |

---

## 二、AI 代理四大組件

黃仁勳把 AI 代理拆解為四個核心組成：

### 1. Model（思考腦）
- 負責理解人類意圖、推理
- LLM 本身

### 2. Harness（作業系統）— 最關鍵組件

**黃仁勳原話：**
> 「大型語言模型負責思考，而 Harness 負責將一切連接在一起，就像作業系統一樣。」

NVIDIA 具體實作：**NVIDIA OpenShell** + **NeMo Agent Toolkit**

Harness 的職責：
- 管理「觀察 → 推理 → 計畫 → 行動」循環
- 處理工作記憶（Working Memory / KV Caching）
- 透過 OpenShell 將代理人**錨定（Grounded）**於企業安全政策與隱私權限
- 決定何時調用哪些脈絡（Context Processing）

### 3. Tools & Skills（技能包）
- CUDA X 庫（cuLitho、cuOpt 等）
- 網路瀏覽器、SQL 資料庫、專業 CAD 工具

### 4. Runtime（工作坊）
- 系統運行的實體環境
- 無論雲端、自駕車、機器人，運算模式一致

---

## 三、GPU / CPU / Harness 的分工

| 角色 | 職責 |
|------|------|
| GPU | 逐步思考、理解情境與意圖、拆解問題 |
| CPU | 路徑規劃，在 GPU 與 CPU 記憶體間傳遞運算思維 |
| Harness | 協調整個過程，最終由 CPU 執行 |

這也是為何黃仁勳特別強調 **Vera CPU** 與 **RTX Spark** 的重要性——Harness 的協調工作落在 CPU 上。

Harness 賦予 AI 三大能力：
1. 思考與推理
2. 使用工具
3. 與記憶協同工作

---

## 四、實際案例：Cadence 晶片設計超級代理

黃仁勳稱此為「我最愛的 AI 代理應用案例」：

| 指標 | 數字 |
|------|------|
| 加速倍數 | **40 倍以上** |
| 原本週期 | 數週的設計驗證 |
| 現在週期 | 只需幾小時 |

NVIDIA 目前有數千名人類晶片設計師，黃仁勳豪言未來將「雇用數十萬個 Cadence 超級代理」與工程師共同工作。

---

## 五、硬體部署矩陣

代理式 AI 將運行在一切設備上：

| 場景 | 產品 |
|------|------|
| 雲端 AI 工廠 | Vera Rubin |
| 個人桌面 | RTX Spark |
| 物理機器人 | Groot |

---

## 六、投資含義

**衡量標準位移：**「Token-per-watt」將成為企業競爭力的核心指標。

**NVIDIA 的護城河邏輯：**
- 不只賣 GPU，而是整套代理架構（Model + Harness + Tools + Runtime）
- CUDA 生態延伸至代理層，形成軟硬體垂直整合
- OpenShell 與 NeMo Toolkit 鎖定企業安全合規需求

**觀察點：**
- NeMo Agent Toolkit 企業客戶採用進度
- Vera Rubin 雲端部署速度（AI 工廠量能）
- RTX Spark 在 PC 端的代理應用生態擴展
- Cadence / Synopsys 等 EDA 合作案例複製速度

---

## 結語

黃仁勳這場演講的核心訊息只有一個：下一個運算週期的競爭，不在模型誰更聰明，而在 **Harness 誰更好用**。NVIDIA 把這個抽象概念具象化為 OpenShell + NeMo，並且用晶片設計案例給出了 40 倍加速的具體承諾。這是從「賣 GPU」到「賣代理作業系統」的戰略位移。
