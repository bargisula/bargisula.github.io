$REPO        = "C:\Users\alpha\my-blog"
$PROMPT_FILE = "$REPO\scripts\taiwan-report-prompt.txt"
$DATE_HYPHEN = (Get-Date).ToString("yyyy-MM-dd")
$OUT_FILE    = "$REPO\src\content\notes\投資\台股\台股快報-$DATE_HYPHEN.mdx"

if (Get-Item $OUT_FILE -ErrorAction SilentlyContinue) {
    Write-Output "SKIP: report already exists for $DATE_HYPHEN"
    exit 0
}

Set-Location $REPO

$prompt = Get-Content $PROMPT_FILE -Raw -Encoding UTF8
gemini -p $prompt --yolo

if (-not (Get-Item $OUT_FILE -ErrorAction SilentlyContinue)) {
    Write-Output "SKIP: market closed or report not generated for $DATE_HYPHEN"
    exit 0
}

Write-Output "DONE: $DATE_HYPHEN"
