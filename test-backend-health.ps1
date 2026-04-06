#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Test Brindra backend health endpoint safely without script execution warning.
.DESCRIPTION
    Uses -UseBasicParsing to avoid parsing risks. Checks http://localhost:5000/api/health.
    Adjust -Uri if backend port differs.
#>

$healthUrl = 'http://localhost:5000/api/health'
try {
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        $content = $response.Content | ConvertFrom-Json
        Write-Host "✅ Backend Health: $($content.service) is OK!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Backend Health Check Failed: Status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error checking backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Ensure backend is running on localhost:5000" -ForegroundColor Yellow
}
