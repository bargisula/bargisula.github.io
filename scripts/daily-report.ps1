$REPO        = "C:\Users\alpha\my-blog"
$PROMPT_FILE = "$REPO\scripts\daily-report-prompt.txt"
$DATE_HYPHEN = (Get-Date).ToString("yyyy-MM-dd")
$DATE_SLASH  = (Get-Date).ToString("yyyy/MM/dd")
$OUT_FILE    = "$REPO\src\content\notes\投資\美股\美股快報-$DATE_HYPHEN.mdx"
$COMMIT_MSG  = "add auto report $DATE_HYPHEN"

if (Get-Item $OUT_FILE -ErrorAction SilentlyContinue) {
    Write-Output "SKIP: report already exists for $DATE_HYPHEN"
    exit 0
}

Set-Location $REPO

$prompt = Get-Content $PROMPT_FILE -Raw -Encoding UTF8
claude -p $prompt --dangerouslySkipPermissions --output-format text

if (-not (Get-Item $OUT_FILE -ErrorAction SilentlyContinue)) {
    Write-Output "ERROR: report not generated, skipping git push"
    exit 1
}

git add "src/content/notes/投資/美股/美股快報-$DATE_HYPHEN.mdx"
git commit -m $COMMIT_MSG
git push origin main

Write-Output "DONE: $DATE_SLASH report pushed to GitHub"
