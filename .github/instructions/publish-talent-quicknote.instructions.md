Skill: publish-talent-quicknote

用途：
- 將使用者提供的文章或 URL 與自動抓取的相關新聞整合成單一「當月快訊」條目（Notes: 投資/當月快訊），遵循 site frontmatter 與 MDX 格式，並自動建立分支、commit、開 PR 或 auto-merge（依 user 選項）。

預設樣式（已同意）：
- 自動套用美編示範樣式：關鍵數字用粗體並用 color 標示（紅/藍/綠/紫/橙），重要段落用淺色背景 highlight；視情況使用 inline HTML/CSS 或 Callout 元件。

MDX 注意事項（重要，請務必遵守）：
- 禁止使用「裸 $數字」；MDX 會把 $...$ 當作 LaTeX。請改用中文「美元」或轉義成 `\$`（例如：每百萬輸入 Token 3 美元，或寫成 `\$3`）。
- 不可使用多層巢狀 Callout；避免 <script> 標籤。
- Frontmatter 必填欄位：title, description（≤60 字）, category, pubDate。topic 不得與 subcategory 同名。

輸入參數：
- source_text_or_url (string | array) — 文章全文或 URL（必填）
- include_auto_search (bool, default: true)
- extra_names (array[string], optional) — 額外要併入的人名
- workflow (enum: "draft","pr","auto-merge") — draft=只產出草稿；pr=建立分支並開 PR；auto-merge=嘗試建立 PR 並合併（需有 token/gh）
- branch_prefix (string, default "notes/add")
- pubDate (string YYYY-MM-DD, optional)

工作流程：
1. 解析輸入文章，擷取標題/要點/時間/人物/情緒標籤，生成單一條目摘要（合併多篇為一則）。
2. 若 include_auto_search=true，嘗試抓取最多 3 個可靠引用（優先 Reuters/NYTimes/TechCrunch/Bloomberg）；失敗則註明「來源待補」。
3. 產生 MDX 片段：title = '【投資】標題'、description ≤60 字、category='投資'、subcategory='當月快訊'、pubDate（台北時區）。
4. 插入到 src/content/notes/投資/當月快訊/YYYY-MM.mdx 頂端，合併為一則（不拆多則）。
5. 套用預設美編樣式（粗體 + color + highlight）。
6. MDX 驗證通過後建立分支、commit、push。commit message 範例：post: add talent quicknote — {short title}\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
7. 根據 workflow 建 PR 或嘗試合併；若無 token，回傳可執行的 gh 命令供使用者在本機執行。
8. 回報輸出：MDX 預覽、檔案路徑、分支名稱、commit SHA、PR URL / merge SHA（如有）、新增來源列表（如有）。

錯誤處理與授權：
- 若缺網路或存取受限，會回報原因並請使用者提供來源或在本機執行 gh。 
- 不會在聊天室要求或儲存敏感憑證。

驗收條件：
- MDX 通過專案驗證，frontmatter 欄位齊全，description ≤60 字，topic ≠ subcategory。
- 若 workflow=auto-merge，PR 成功合併並觸發 Actions。

呼叫範例（JSON）：
{
  "source_text_or_url":"<URL 或 文章全文>",
  "include_auto_search": true,
  "workflow":"pr",
  "branch_prefix":"notes/add",
  "pubDate":"2026-06-20"
}

說明：此檔案為 Copilot CLI instructions，建立後 CLI 的 /skills 應顯示 publish-talent-quicknote 並套用上述預設。若需調整顏色或改用 Callout 元件，請修改此檔並重新部署。
