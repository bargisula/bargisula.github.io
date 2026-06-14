---
name: dsmm-dismiss
description: >
  駁回 dsmm-scout 產生的候選情境（不升格）。
  呼叫方式：/dsmm-dismiss TC-CAND-YYYYMMDD-NNN [原因]
---

## 執行步驟

讀取 `data/dsmm/candidates/{candidate_id}.json`，
將 `status` 改為 `"dismissed"`，加入 `dismissed_date` 和 `dismiss_reason`（若有提供原因）。

更新 `data/dsmm/candidates/index.json`：
- 從 `pending_review` 移除
- 加入 `dismissed`

回報：`已駁回 {candidate_id}：{proposed_name}`
