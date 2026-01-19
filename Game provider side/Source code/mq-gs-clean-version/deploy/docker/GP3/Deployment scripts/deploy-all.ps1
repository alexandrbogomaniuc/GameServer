<#
.SYNOPSIS
    Deploy All Services with comprehensive logging and clear status banners
.DESCRIPTION
    Deploys all services (infrastructure, MP Lobby, Game Server) in the correct order
.PARAMETER SkipBuild
    Skip Maven builds and use existing WAR files
#>

param([switch]$SkipBuild = $false)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogDir = "$ScriptDir\logs"
$LogFile = "$LogDir\deploy-all-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

# ============================================
# HELPER FUNCTIONS
# ============================================

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Level] $Message"
    
    switch ($Level) {
        "SUCCESS" { Write-Host $LogMessage -ForegroundColor Green }
        "ERROR" { Write-Host $LogMessage -ForegroundColor Red }
        "WARN" { Write-Host $LogMessage -ForegroundColor Yellow }
        default { Write-Host $LogMessage }
    }
    Add-Content -Path $LogFile -Value $LogMessage
}

function Write-Banner {
    param([string]$Message, [bool]$IsSuccess)
    $border = "=" * 60
    $color = if ($IsSuccess) { "Green" } else { "Red" }
    $bgColor = if ($IsSuccess) { "DarkGreen" } else { "DarkRed" }
    
    Write-Host ""
    Write-Host $border -ForegroundColor $color
    Write-Host ("  " + $Message.ToUpper().PadRight(56)) -ForegroundColor White -BackgroundColor $bgColor
    Write-Host $border -ForegroundColor $color
    Write-Host ""
    Add-Content -Path $LogFile -Value "$border`n  $Message`n$border"
}

# ============================================
# DEPLOYMENT START
# ============================================

Write-Banner "FULL DEPLOYMENT STARTING" $true
Write-Log "Log file: $LogFile" "INFO"

# STEP 1: Infrastructure
Write-Log "======== STEP 1: INFRASTRUCTURE ========" "INFO"
try {
    & "$ScriptDir\restart-infrastructure.ps1"
    Write-Log "Infrastructure started successfully" "SUCCESS"
}
catch {
    Write-Log "Infrastructure failed: $($_.Exception.Message)" "ERROR"
    Write-Banner "DEPLOYMENT FAILED - INFRASTRUCTURE" $false
    exit 1
}

# STEP 2: MP Lobby
Write-Log "======== STEP 2: MP LOBBY ========" "INFO"
try {
    $buildFlag = if ($SkipBuild) { "-SkipBuild" } else { "" }
    & "$ScriptDir\deploy-mp-lobby.ps1" $buildFlag
    Write-Log "MP Lobby deployed successfully" "SUCCESS"
}
catch {
    Write-Log "MP Lobby failed: $($_.Exception.Message)" "ERROR"
    Write-Banner "DEPLOYMENT FAILED - MP LOBBY" $false
    exit 1
}

# STEP 3: Game Server
Write-Log "======== STEP 3: GAME SERVER ========" "INFO"
try {
    $buildFlag = if ($SkipBuild) { "-SkipBuild" } else { "" }
    & "$ScriptDir\deploy-game-server.ps1" $buildFlag
    Write-Log "Game Server deployed successfully" "SUCCESS"
}
catch {
    Write-Log "Game Server failed: $($_.Exception.Message)" "ERROR"
    Write-Banner "DEPLOYMENT FAILED - GAME SERVER" $false
    exit 1
}

# ============================================
# FINAL STATUS
# ============================================

Write-Banner "ALL SERVICES DEPLOYED SUCCESSFULLY!" $true
Write-Host "  Infrastructure: Cassandra, Zookeeper, Kafka" -ForegroundColor Cyan
Write-Host "  MP Lobby:       http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Game Server:    http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Test Game URL:" -ForegroundColor Yellow
Write-Host "  http://localhost:8081/cwstartgamev2.do?bankId=6274&gameId=838&mode=real&token=test&lang=en" -ForegroundColor Yellow
Write-Host ""
Write-Log "Full deployment completed successfully" "SUCCESS"
