---
name: position-tracking-system
description: 論點追蹤系統架構：data/positions/ 存各標的條件式論點，防止 LLM 每次自由生成
metadata:
  type: project
---

# 論點追蹤系統

建立於 2026-05-20，核心目的：讓 LLM 的任務從「重新分析」變成「檢查條件是否仍成立」。

## 架構

- **AI 晶片四檔（NVDA/AMD/AVGO/QCOM）**：`data/coverage/ai-chips/[TICKER].json`
  - 含 `conditions`（支撐條件）+ `kill_switches`（否定條件）欄位
  - `ai-infra-researcher` 的 Step 0 強制做條件檢核，不自由生成

- **其他個股**：`data/positions/[TICKER].md`

- **產業論點**：`data/positions/sectors/[主題].md`
  - `industry-analyst` 的 Step 0 強制查此目錄
  - 目前有：`tw-drone.md`（台灣無人機，2026-05-20）

- **模板**：`data/positions/_TEMPLATE.md`

## 條件寫法規則

- 必須「可被新聞/財報資料回答」，不能是感覺
- conditions：論點成立需要什麼持續成立
- kill_switches：什麼具體事件發生等於論點死亡

## Why

**Why:** 防止 LLM 每次從頭自由發揮，等於每次重新擲骰子。有了條件追蹤，下次看同標的，任務是「C1–C5 哪些變了？」而不是「你覺得 NVDA 怎樣？」

**How to apply:** 任何時候要分析已有 position 的標的，先讀 position 檔，把條件清單給 agent，要求逐條裁定。
