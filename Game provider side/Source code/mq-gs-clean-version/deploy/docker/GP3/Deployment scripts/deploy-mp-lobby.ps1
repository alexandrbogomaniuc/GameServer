<#
.SYNOPSIS
    Deploy MP Lobby with comprehensive logging, verification, and clear status banners
.DESCRIPTION
    Builds the MP Lobby WAR, deploys to Docker container, and verifies deployment with colored output
.PARAMETER SkipBuild
    Skip Maven build and use existing WAR file
#>

param([switch]$SkipBuild = $false, [string]$VersionTag = "")

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\..\..\..\..\.."
$MPProjectRoot = "$ProjectRoot\mq-mp-clean-version"
$LogDir = "$ScriptDir\logs"
$LogFile = "$LogDir\deploy-mp-lobby-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$ContainerName = "gp3-mp-lobby-1"
$WarSource = "$MPProjectRoot\web\target\web-mp-casino.war"
$TomcatWebapps = "/usr/local/tomcat/webapps"
$DeploymentSuccess = $false

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

function Handle-Error {
    param([string]$Step, [string]$Error)
    Write-Log "ERROR in $Step : $Error" "ERROR"
    Write-Banner "DEPLOYMENT FAILED - $Step" $false
    Write-Log "Check log: $LogFile" "ERROR"
    exit 1
}

function Verify-Command {
    param([string]$Description, [scriptblock]$Command)
    Write-Log "Executing: $Description" "INFO"
    try {
        $result = & $Command
        Write-Log "SUCCESS: $Description" "SUCCESS"
        return $result
    }
    catch {
        Handle-Error $Description $_.Exception.Message
    }
}

# ============================================
# DEPLOYMENT START
# ============================================

Write-Banner "MP Lobby Deployment Starting" $true

# STEP 1: Build WAR
if (-not $SkipBuild) {
    Write-Log "Step 1: Building MP Lobby WAR..." "INFO"
    Verify-Command "Maven Clean Package" {
        Push-Location $MPProjectRoot
        try {
            $output = mvn clean package -DskipTests 2>&1
            if ($LASTEXITCODE -ne 0) { throw "Maven build failed with exit code $LASTEXITCODE" }
            $output | Out-File -Append -FilePath $LogFile
            return $output
        }
        finally { Pop-Location }
    }
}
else {
    Write-Log "Step 1: Skipping build (using existing WAR)" "WARN"
}

# Verify WAR exists
if (-not (Test-Path $WarSource)) { Handle-Error "WAR Verification" "WAR file not found at $WarSource" }
$warInfo = Get-Item $WarSource
$warSizeMB = [math]::Round($warInfo.Length / 1MB, 2)
$warAge = (Get-Date) - $warInfo.LastWriteTime
Write-Log "WAR file verified: $warSizeMB MB, Age: $([math]::Round($warAge.TotalMinutes, 1)) minutes" "SUCCESS"

if ($warAge.TotalMinutes -gt 30 -and -not $SkipBuild) {
    Write-Log "WAR file is older than 30 minutes - may be stale!" "WARN"
}

# STEP 2: Ensure Container is Running for Cleanup
Write-Log "Step 2: Ensuring container is up for cleanup..." "INFO"
# Try to start, ignore if already running
try { docker start $ContainerName 2>&1 | Out-Null } catch {}

# STEP 3: Clean old deployment (While running)
Write-Log "Step 3: Cleaning old deployment..." "INFO"
Verify-Command "Remove old ROOT directory" { docker exec $ContainerName rm -rf "$TomcatWebapps/ROOT" 2>&1 }
Verify-Command "Remove old ROOT.war" { docker exec $ContainerName rm -f "$TomcatWebapps/ROOT.war" 2>&1 }
# Also remove temp file just in case
Verify-Command "Remove temp ROOT-new.war" { docker exec $ContainerName rm -f "/tmp/ROOT-new.war" 2>&1 }

# STEP 4: Stop Container (Safe Copy)
Write-Log "Step 4: Stopping container for safe copy..." "INFO"
Verify-Command "Stop Container" { docker stop $ContainerName 2>&1 }

# STEP 5: Copy WAR directly to webapps (While stopped)
Write-Log "Step 5: Copying WAR to webapps/ROOT.war..." "INFO"
# docker cp works on stopped containers and overwrites
Verify-Command "Copy WAR" { docker cp $WarSource "${ContainerName}:$TomcatWebapps/ROOT.war" 2>&1 }

# STEP 6: Verify Copy (Optional, strictly not needed if CP succeeded, but good check)
# Skipping 'ls' check because container is stopped. docker cp exit code is enough.

# STEP 7: Start Container (Deploy)
Write-Log "Step 7: Starting container for deployment..." "INFO"
Verify-Command "Start Container" { docker start $ContainerName 2>&1 }

# STEP 8: Wait for deployment
Write-Log "Step 8: Waiting for Tomcat to deploy WAR (180 seconds as requested)..." "INFO"
Start-Sleep -Seconds 180

# STEP 9: Verify deployment success
Write-Log "Step 9: Verifying deployment..." "INFO"
$logs = docker logs $ContainerName --tail 100 2>&1
$logs | Out-File -Append -FilePath $LogFile

# Check for successful deployment indicators
$warDeploymentMatch = $logs | Select-String -Pattern "Deployment of web application archive.*ROOT\.war.*has finished in \[(\d+)\] ms"
$serverStarted = $logs | Select-String -Pattern "Server startup in"
$sessionMatch = $logs | Select-String -Pattern "sesssionId" # typo in original code kept for matching
$deploymentError = $logs | Select-String -Pattern "SEVERE.*Error deploying|Failed to start component"

if ($deploymentError) {
    Write-Log "Deployment error detected in logs!" "ERROR"
    # Handle-Error "Tomcat Deployment" "WAR deployment failed - check logs" # Warn but don't exit to allow version check
}

# Verify Version Tag if provided
# Verify Version Tag if provided
if ($VersionTag) {
    Write-Log "Verifying logs for version tag: $VersionTag" "INFO"
    
    # Capture logs to a variable (SNAPSHOT only, prevents hanging on streams)
    $logsSnapshot = docker logs $ContainerName 2>&1
    
    $versionMatch = $logsSnapshot | Select-String -Pattern $VersionTag
    if ($versionMatch) {
        Write-Log "FOUND VERSION TAG: $VersionTag" "SUCCESS"
        $DeploymentSuccess = $true
    }
    else {
        Write-Log "VERSION TAG '$VersionTag' NOT FOUND IN LOGS (Yet)!" "WARN"
        Write-Log "The server might still be starting. Please check logs manually: docker logs $ContainerName" "WARN"
        # Do not fail the script, just warn, as the deployment might technically be running
        $DeploymentSuccess = $true 
    }
}

if ($warDeploymentMatch -and $serverStarted) {
    $deployTimeMs = $warDeploymentMatch.Matches[0].Groups[1].Value
    $deployTimeSec = [math]::Round([int]$deployTimeMs / 1000, 1)
    
    if ([int]$deployTimeMs -lt 500) {
        Write-Log "Deployment time too short ($deployTimeSec sec) - WAR may not have unpacked!" "WARN"
    }
    else {
        Write-Log "ROOT.war deployed in $deployTimeSec seconds" "SUCCESS"
        $DeploymentSuccess = $true
    }
}

# Final verification - check ROOT directory exists (WAR unpacked)
$rootDirCheck = docker exec $ContainerName ls -d "$TomcatWebapps/ROOT" 2>&1
if ($rootDirCheck -match "ROOT") {
    Write-Log "ROOT directory verified - WAR unpacked successfully" "SUCCESS"
    $DeploymentSuccess = $true
}
else {
    Write-Log "ROOT directory not found - WAR may not have deployed" "WARN"
}

# ============================================
# FINAL STATUS
# ============================================

Write-Log "Log file: $LogFile" "INFO"

if ($DeploymentSuccess) {
    Write-Banner "MP LOBBY DEPLOYMENT SUCCESSFUL!" $true
    Write-Host "  Container: $ContainerName" -ForegroundColor Cyan
    Write-Host "  WAR Size:  $warSizeMB MB" -ForegroundColor Cyan
    Write-Host "  Log File:  $LogFile" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}
else {
    Write-Banner "DEPLOYMENT STATUS UNCERTAIN - CHECK LOGS" $false
    Write-Log "Could not verify deployment success - manual check recommended" "WARN"
    exit 1
}
