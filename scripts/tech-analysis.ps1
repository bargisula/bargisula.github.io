# Usage:
#   .\tech-analysis.ps1 -Keyword CoPoS
#   .\tech-analysis.ps1 -Keyword HBM4 -LLM gemini
#   .\tech-analysis.ps1 -Keyword CoWoS -LLM claude

param(
    [Parameter(Mandatory=$true)]
    [string]$Keyword,

    [ValidateSet("claude", "gemini")]
    [string]$LLM = "claude"
)

$REPO        = "C:\Users\alpha\my-blog"
$PROMPT_FILE = "$REPO\scripts\tech-analysis-prompt.txt"

Set-Location $REPO

$prompt = Get-Content $PROMPT_FILE -Raw -Encoding UTF8
$prompt = $prompt -replace '\[KEYWORD\]', $Keyword

switch ($LLM) {
    "gemini" {
        $prompt | gemini --yolo
    }
    "claude" {
        $prompt | claude -p - --dangerouslySkipPermissions --output-format text
    }
}

Write-Output "DONE: $Keyword"
