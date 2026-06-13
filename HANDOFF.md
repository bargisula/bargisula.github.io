# 交接檔 — Xompass 系統維護

> 給下一個 session 的 Claude：先讀完這份，再開始工作。讀完請跟董事長確認「已接上，待辦如下」。
> 建立：2026-06-13　上一次工作：系統止血修復 + 新增戰績記分板

---

## 1. 立即待辦（董事長開 session 後優先）

- [ ] **推送**：上次的兩個 commit 還沒 push → `git push origin main`
- [ ] **驗收 `/status`**：確認新加的【洞察庫】【戰績記分板】兩區塊正常吐數字
- [ ] **驗收 `/meeting`、`/discuss`**：問總經問題時，CEO 應正確調度 `cmo`（不再靜默降級成自己回答）

---

## 2. 上次 session 做了什麼（2026-06-13）

### Commit 1 `cbd03f3` — 止血修復
- **修斷鏈**：`ceo.md` / `discuss.md` 的調度表原本叫 `chief-economist`，但系統沒有這個 agent（實際註冊名是 `cmo`）。已全部改成 `cmo`，與 `meeting.md` 對齊。
- **晨會去重**：`ceo.md` 原本重抄了一份完整晨會流程，與 `commands/meeting.md` 打架。已移除，改為一行指標——**晨會流程的唯一真相 = `.claude/commands/meeting.md`**。
- **CIO 清理**：`cio.md` 移除已停用的 `news-scout` 引用，改讀 DNI 的 `data/intel/` 快取。
- **文件對齊**：`XOMPASS.md` / `SYSTEM.md` 加上「快照警告」橫幅，標明它們是人工快照、可能過期，**真相以 `.claude/` 檔案為準**。

### Commit 2 `88558be` — 新增戰績記分板
- **新檔 `data/scoreboard.json`**：聚合 picks（個股建議）與 insights（因果洞察）的命中率，是系統的「打擊率」。
- `data/tracking/picks.json` 的 `stats` 修正（原本停在 total:1，實際有 2 筆）。
- `status.md` 新增【洞察庫】【戰績記分板】兩區塊（`/status` 會顯示）。
- `pmc.md` 新增 **Step 4：結案強制回填記分板**——這是防止記分板像舊 picks.stats 一樣停擺的關鍵。

---

## 3. 必須記住的系統事實（避免重蹈覆轍）

1. **沒有 agent 中央註冊檔**。每個 `.claude/agents/*.md` 靠自己的 `name:` 欄位自我註冊。要看清單：`grep "^name:" .claude/agents/*.md`。調度名打錯 → 靜默降級，不報錯。
2. **記分板必須回填才有意義**。任何 pick 結案、insight 失效，都要更新 `data/scoreboard.json`（流程寫在 `pmc.md` Step 4）。不回填就會停在舊數字。
3. **不要新建會 desync 的狀態檔**。現有狀態已分層：`insights.json`（因果信念）→ `positions/sectors/*.md`（板塊論點+條件+kill switch）→ `picks.json`（可執行建議+結果）。`/status` 是唯讀總覽。要加東西先想「會不會多一個要同步的來源」。
4. **本 session 根目錄要在 `C:\Users\alpha\my-blog`**，否則 skill/agent 的相對路徑（`data/...`）讀不到檔。

---

## 4. 已討論但暫緩的事項

- **記分板 Phase 2**：目前只涵蓋 picks + insights，可擴充到 meeting 的「裁定」追蹤（需解析會議紀錄格式，較重）。
- **C-suite 精簡**：經查 DNI/CMO/CTO 都做實工，未被調度的 agent ≈ 零 token，**結論為不砍**。此議題已關閉，除非董事長另有想法。
- **網頁化討論**：展示層（blog）零 token 成本可放心擴；操作層維持 Claude Code 當引擎即可，不要裸打 API 重寫。

---

*工作完成後，請更新或刪除本檔，避免下次誤讀為「待辦」。*
