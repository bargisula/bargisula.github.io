# 專案開發與內容維護指南 (GEMINI.md)

這是本專案的維護指南，任何 AI 代理人在執行任務前必須閱讀並嚴格遵守。

## 1. 內容管理 (Astro Content Collections)
所有的筆記存放在 `src/content/notes/` 下。
- **建立新專題**：不能只建立資料夾。必須至少包含一個 `.md` 或 `.mdx` 檔案。
- **Frontmatter 規範**：每篇文章必須包含以下欄位：
  - `title`: 標題
  - `description`: 描述
  - `category`: 大分類（如：經濟、投資、軍事、小說與推薦書、勞動、雜記）
  - `subcategory`: 次分類（如：歷史、美股、商業革命等）
  - `topic`: 專題名稱（對應 UI 上的卡片）
  - `pubDate`: 發布日期 (YYYY-MM-DD)
- **Topic 一致性**：檔案內的 `topic` 欄位文字必須與 `src/pages/notes/index.astro` 中 `CATEGORY_TREE` 定義的名稱完全一致。

## 2. UI 顯示邏輯 (核心規則)
本站的分類卡片是**手動註冊制**，而非自動掃描資料夾。
- **新增專題卡片**：
  1. 修改 `src/pages/notes/index.astro`。
  2. 找到 `CATEGORY_TREE` 常數。
  3. 在對應的 `name` (category) -> `subs` (subcategory) 下，將新專題名稱加入 `topics` 陣列中。
  4. **若未執行此步驟，新專題將不會出現在首頁入口卡片中。**

## 3. Git 與部署規範
- **提交變更**：完成修改後，必須執行 `git add .`、`git commit` 與 `git push`。
- **驗證部署**：必須確認 GitHub Actions (Build/Deploy) 流程執行成功。
- **禁止行為**：
  - 除非使用者明確要求，否則禁止移動現有的文章路徑。
  - 禁止在未更新 `CATEGORY_TREE` 的情況下宣稱「新分類已建立完成」。

## 4. 檔案結構參考
- `src/content/notes/[Category]/[Subcategory]/[Topic]/[Article].md`
- 專題入口文建議命名為：`專題說明-[Topic].md`

## 5. 常用快捷指令 (Quick Commands)
為了提高開發效率，本專案定義了以下快捷指令：
- **「寫台股快報」**：
  - **執行邏輯**：讀取並嚴格遵循 `scripts/taiwan-report-prompt.txt` 中的指示。
  - **流程**：自動搜尋當日收盤數據、三大法人籌碼、焦點新聞及美股期指，生成 MDX 檔案，最後執行 Git 提交與推送。
  - **檔案路徑**：`src/content/notes/投資/台股/台股快報-YYYY-MM-DD.mdx`
- **「寫美股快報」**：
  - **執行邏輯**：比照 `scripts/us-tech-analysis-prompt.txt` 的規範執行。
- **「執行技術分析」**：
  - **執行邏輯**：使用 `scripts/tech-analysis-skill.md` 定義的流程進行深度分析。
- 「寫台股夜間攻略」：
  - **執行邏輯**：針對次日開盤準備。
  - **流程**：彙整當日大盤收盤指數、成交量、三大法人買賣超與期貨淨部位；追蹤台指期夜盤、TSMC ADR 及美股重大數據；篩選 3-5 則影響次日之焦點新聞，最後給出戰術結論。
  - **檔案路徑**：`src/content/notes/投資/台股/台股攻略-YYYY-MM-DD.md`
- **「日報」(勞動、軍事、理財、不動產)**：
  - **執行邏輯**：當使用者要求「日報」或「寫 X 日報」時，必須執行此流程。
  - **流程**：同時搜尋「勞動、軍事、理財、不動產」四大領域的當日時事，**彙整所有候選標題清單供使用者挑選**。確認挑選項目後，再依照各類別格式生成對應的 MD 檔案。
  - **檔案路徑**：分別存放於 `src/content/notes/` 下對應的 `勞動/勞動日報/`、`軍事/區域防禦/`、`投資/理財日報/` 及 `投資/其他投資/不動產/` 資料夾中。
