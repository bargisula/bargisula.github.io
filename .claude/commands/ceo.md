# /ceo：執行長系統診斷

**模式：$ARGUMENTS**

---

## 用法

```
/ceo audit     → 隨機抽查 5 篇文章，評分並給修改建議
/ceo strategy  → 分析現有分類缺口，建議新增方向
/ceo system    → 盤點所有 agents/skills，找出問題與缺口
/ceo memory    → 建議應加入 CLAUDE.md 的知識與 hook 設定
/ceo token     → 分析各 agent prompt 效率，建議壓縮與模型分配
```

若 $ARGUMENTS 為空，輸出使用說明並列出目前系統概覽。

---

## 執行

將 $ARGUMENTS 作為模式參數，呼叫 CEO agent 執行對應模式。

若輸入的模式不在上述五種中，回覆：
「模式不存在。可用模式：audit / strategy / system / memory / token」
