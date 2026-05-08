$REPO        = "C:\Users\alpha\my-blog"
$PROMPT_FILE = "$REPO\scripts\daily-report-prompt.txt"
$DATE_HYPHEN = (Get-Date).ToString("yyyy-MM-dd")
$DATE_SLASH  = (Get-Date).ToString("yyyy/MM/dd")
$OUT_FILE    = "$REPO\src\content\notes\投資\美股\美股快報-$DATE_HYPHEN.mdx"

if (Test-Path $OUT_FILE) {
    Write-Output "快報已存在，跳過：$OUT_FILE"
    exit 0
}

Set-Location $REPO

# 執行 claude 生成快報
$prompt = Get-Content $PROMPT_FILE -Raw -Encoding UTF8
claude -p $prompt --allowedTools "Read,Write,WebSearch,Glob,Bash" --output-format text

# 確認檔案有產出才 commit
if (-not (Test-Path $OUT_FILE)) {
    Write-Output "❌ 快報未產出，跳過 git push"
    exit 1
}

# git commit & push
git add "src/content/notes/投資/美股/美股快報-$DATE_HYPHEN.mdx"
git commit -m "add 美股快報 $DATE_SLASH 開盤前"
git push origin main

Write-Output "✅ 美股快報 $DATE_SLASH 已完成並推上 GitHub"
