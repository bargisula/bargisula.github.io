# 自動美股快報：週一至週五 20:30 觸發
# 由 Windows 工作排程器呼叫，不需要 Claude 桌面版開著

$logDir = "C:\Users\alpha\my-blog\scripts\logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = "$logDir\market-report.log"

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
Add-Content $logFile "$timestamp - 開始執行美股快報"

try {
    $claude = "C:\Users\alpha\AppData\Roaming\npm\claude.cmd"
    $workDir = "C:\Users\alpha\my-blog"

    $result = & $claude `
        --print `
        --dangerously-skip-permissions `
        "/us-market-open-report" `
        2>&1

    Add-Content $logFile "$timestamp - 完成：$($result | Select-Object -Last 3 | Out-String)"
} catch {
    Add-Content $logFile "$timestamp - 失敗：$_"
}
