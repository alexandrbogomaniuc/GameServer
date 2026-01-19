<#
.SYNOPSIS
    Restart Infrastructure containers (Cassandra, Zookeeper, Kafka)
.DESCRIPTION
    Restarts infrastructure containers with colored status output
#>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogDir = "$ScriptDir\logs"
$LogFile = "$LogDir\restart-infra-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

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
# INFRASTRUCTURE RESTART
# ============================================

Write-Banner "INFRASTRUCTURE RESTART STARTING" $true

$containers = @("gp3-c1-1", "gp3-zookeeper-1", "gp3-kafka-1")

foreach ($container in $containers) {
    Write-Log "Restarting $container..." "INFO"
    $result = docker restart $container 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Log "$container restarted successfully" "SUCCESS"
    }
    else {
        Write-Log "Failed to restart $container: $result" "ERROR"
    }
}

Write-Log "Waiting 30 seconds for infrastructure to stabilize..." "INFO"
Start-Sleep -Seconds 30

# Verify containers are running
$allRunning = $true
foreach ($container in $containers) {
    $status = docker inspect -f '{{.State.Running}}' $container 2>&1
    if ($status -eq "true") {
        Write-Log "$container is running" "SUCCESS"
    }
    else {
        Write-Log "$container is NOT running" "ERROR"
        $allRunning = $false
    }
}

if ($allRunning) {
    Write-Banner "INFRASTRUCTURE RESTART SUCCESSFUL!" $true
}
else {
    Write-Banner "INFRASTRUCTURE RESTART FAILED - CHECK LOGS" $false
    exit 1
}
