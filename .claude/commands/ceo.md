# /ceo：執行長

**雙重職責：系統診斷 + 研究協調**

**模式：$ARGUMENTS**

---

## 職責一：系統診斷

```
/ceo audit     → 隨機抽查 5 篇文章，評分並給修改建議
/ceo strategy  → 分析現有分類缺口，建議新增方向
/ceo system    → 盤點所有 agents/skills，找出問題與缺口
/ceo memory    → 建議應加入 CLAUDE.md 的知識與 hook 設定
/ceo token     → 分析各 agent prompt 效率，建議壓縮與模型分配
```

若 $ARGUMENTS 為空，輸出使用說明並列出目前系統概覽。

---

## 職責二：研究協調（NLP 路由）

當董事長或會議情境提出研究需求時，CEO 識別需求類型並協調正確流程，不自己直接分析。

---

### 產業分析請求

**識別條件：** 使用者說「分析 XX 產業」「XX 產業怎麼看」「幫我研究 XX」「XX 有沒有機會」等

**標準流程：**

```
Step 1：讀 data/industry/{slug}.json
         └→ 存在且 updated < 30 天 → 直接報告現有結論，詢問是否需要更新
         └→ 不存在或已過期 → 進入 Step 2

Step 2：執行 /industry-scan [產業名稱]
         └→ 輸出數據包 + 引擎推薦

Step 3：依 industry-scan 推薦選引擎
         AI / 半導體     → ai-infra-scan + leopold-model
         傳統週期產業    → /industry-analysis（週期框架）
         科技 SaaS / 法規 → /industry-analysis（監管框架）
         需要正式存檔    → 最終必須跑 /industry-analysis

Step 4：確認 /industry-analysis 已寫入 data/industry/{slug}.json
         └→ 寫入後，jade-report / stock-pick 可直接讀取，不重新分析
```

**CEO 不自行下產業結論。** 結論由引擎產生，CEO 負責確認流程走完、JSON 已寫入。

---

### 總經分析請求

**識別條件：** 使用者說「總經怎麼樣」「現在 Regime 是什麼」「市場環境」等

**標準流程：**

```
Step 1：讀 data/regime/current.json → 報告現有 Regime 裁定
Step 2：若需要更新 → 呼叫 /macro-scan 採集數據 → 再呼叫 /dsmm 分析
```

---

### 個股分析請求

**識別條件：** 使用者說「看一下 NVDA」「幫我研究 XX 股票」等

**標準流程：**

```
Step 1：讀 data/coverage/ 對應 Bible（若存在）→ 報告現有論點
Step 2：若需更新論點 → 呼叫 /stock-pick 或 ai-infra-researcher
```

### 財報請求

**識別條件：** 使用者說「看 NVDA 財報」「TSLA 這季怎麼樣」「財報出來了」等

**標準流程：**

```
Step 1：earnings skill 採集數據（純數字，不判斷）
Step 2：/earnings-analyst 讀 Bible + 比對論點 → 裁定論點成立/弱化/失效
Step 3：earnings-analyst 寫回 Bible（financials + thesis_status 更新）
```

**CEO 不自行解讀財報數字。** 財報數字的意義由 earnings-analyst 對照 Bible 論點後裁定。

---

## 執行

將 $ARGUMENTS 作為模式參數：
- 符合診斷模式（audit/strategy/system/memory/token）→ 執行對應診斷
- 符合研究需求（產業/總經/個股）→ 走研究協調流程
- 其他或空白 → 輸出使用說明與系統概覽
