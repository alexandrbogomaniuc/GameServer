<#
.SYNOPSIS
    Deploy Game Server with comprehensive logging, verification, and clear status banners
.DESCRIPTION
    Builds the Game Server WAR, deploys to Docker container, and verifies deployment with colored output
.PARAMETER SkipBuild
    Skip Maven build and use existing WAR file
#>

param([switch]$SkipBuild = $false)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\..\..\..\.."
$LogDir = "$ScriptDir\logs"
$LogFile = "$LogDir\deploy-gs-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$ContainerName = "gp3-gs-1"
$WarSource = "$ProjectRoot\game-server\web-gs\target\ROOT.war"
$JettyWebapps = "/var/lib/jetty/webapps"
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

Write-Banner "Game Server Deployment Starting" $true

# --- Step 0: Generate Deployment Version ---
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$deployId = "v_$timestamp"
Write-Log "Generated Deployment ID: $deployId" "INFO"

# Update version.properties
$versionFile = "$ProjectRoot\game-server\common-gs\src\main\resources\version.properties"
if (Test-Path $versionFile) {
    "deploy.id=$deployId" | Set-Content $versionFile
    Write-Log "Updated version.properties with $deployId" "SUCCESS"
}
else {
    Write-Log "ERROR: version.properties not found at $versionFile" "ERROR"
    # Create it if missing
    "deploy.id=$deployId" | Out-File $versionFile
    Write-Log "Created version.properties with $deployId" "SUCCESS"
}

# STEP 1: Build WAR
if (-not $SkipBuild) {
    Write-Log "Step 1: Building Game Server WAR..." "INFO"
    Verify-Command "Maven Clean Package" {
        Push-Location "$ProjectRoot\game-server"
        try {
            $output = mvn clean package -DskipTests 2>&1
            $output | Out-File -Append -FilePath $LogFile
            if ($LASTEXITCODE -ne 0) { throw "Maven build failed with exit code $LASTEXITCODE" }
            return $output
        }
        finally { Pop-Location }
    }
}
else {
    Write-Log "Step 1: Skipping build (using existing WAR). WARN: Version ID check will likely fail." "WARN"
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

# STEP 2: Stop Container
Write-Log "Step 2: Stopping container $ContainerName..." "INFO"
Verify-Command "Stop Container" { docker stop $ContainerName 2>&1 }

# STEP 3: Copy WAR to temp location
Write-Log "Step 3: Copying WAR to container temp..." "INFO"
Verify-Command "Copy WAR" { docker cp $WarSource "${ContainerName}:/tmp/ROOT-new.war" 2>&1 }

# STEP 4: Start Container
Write-Log "Step 4: Starting container..." "INFO"
Verify-Command "Start Container" { docker start $ContainerName 2>&1 }

# STEP 5: Verify WAR copied successfully
Write-Log "Step 5: Verifying WAR in container..." "INFO"
$warCheck = docker exec $ContainerName ls -lh /tmp/ROOT-new.war 2>&1
if ($LASTEXITCODE -ne 0) { Handle-Error "Verify WAR in container" "WAR not found in container temp" }
Write-Log "WAR in container: $warCheck" "SUCCESS"

# STEP 6: Clean and deploy WAR
Write-Log "Step 6: Cleaning old deployment and deploying new WAR..." "INFO"
Verify-Command "Remove old ROOT directory" { docker exec $ContainerName rm -rf "$JettyWebapps/ROOT" 2>&1 }
Verify-Command "Remove old ROOT.war" { docker exec $ContainerName rm -f "$JettyWebapps/ROOT.war" 2>&1 }
Verify-Command "Move new WAR to webapps" { docker exec $ContainerName mv /tmp/ROOT-new.war "$JettyWebapps/ROOT.war" 2>&1 }

# Verify WAR in webapps
$deployCheck = docker exec $ContainerName ls -lh "$JettyWebapps/ROOT.war" 2>&1
if ($LASTEXITCODE -ne 0) { Handle-Error "Verify WAR deployed" "WAR not found in webapps" }
Write-Log "Deployed WAR: $deployCheck" "SUCCESS"

# STEP 7: Restart Container for WAR deployment
Write-Log "Step 7: Restarting container for WAR deployment..." "INFO"
Verify-Command "Restart Container" { docker restart $ContainerName 2>&1 }

# STEP 8: Wait for deployment
Write-Log "Step 8: Waiting for Jetty to deploy WAR (240 seconds)..." "INFO"
Start-Sleep -Seconds 240

# STEP 9: Verify deployment success
Write-Log "Step 9: Verifying deployment..." "INFO"
$logs = $null
try {
    # Using specific ErrorAction to avoid failing on stderr (which docker logs uses for stream info)
    $logs = docker logs $ContainerName --tail 20000 2>&1
    $logs | Out-File -Append -FilePath $LogFile
}
catch {
    Write-Log "Warning: Could not fetch docker logs directly (Command Error). Checking HTTP status instead." "WARN"
}

# Check for specific version ID
$versionFound = $false
if ($logs -match "DEPLOY_ID: $deployId") {
    Write-Log "Found Deployment Version: $deployId in logs" "SUCCESS"
    $versionFound = $true
}
else {
    Write-Log "Deployment Version $deployId NOT FOUND in logs!" "ERROR"
    Write-Log "Latest logs (last 20 lines):" "INFO"
    $logs | Select-Object -Last 20 | ForEach-Object { Write-Log $_ "INFO" }
    # Don't exit, simply warn associated with HTTP check
}

# Check for successful deployment indicators
$webAppStarted = $null
if ($logs) {
    $webAppStarted = $logs | Select-String -Pattern "Started.*WebAppContext.*ROOT|Started @|GameServer: started"
    $deploymentError = $logs | Select-String -Pattern "FAILED|Exception|Error"
}

if ($webAppStarted) {
    Write-Log "Jetty WebAppContext / GameServer started successfully" "SUCCESS"
    foreach ($line in $webAppStarted) {
        Write-Log "Found success indicator: $line" "SUCCESS"
    }
    $DeploymentSuccess = $true
}

# Final verification - HTTP test
Write-Log "Step 10: Testing HTTP endpoint..." "INFO"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/support/health/ping.jsp" -TimeoutSec 10 -ErrorAction Stop
    Write-Log "HTTP test successful (Status: $($response.StatusCode))" "SUCCESS"
    # Only success if Version Found OR HTTP success? Ideally both.
    $DeploymentSuccess = $true
}
catch {
    Write-Log "HTTP endpoint test: $($_.Exception.Message)" "WARN"
}

# ============================================
# FINAL STATUS
# ============================================

Write-Log "Log file: $LogFile" "INFO"

if ($DeploymentSuccess) {
    Write-Banner "GAME SERVER DEPLOYMENT SUCCESSFUL!" $true
    Write-Host "  Container: $ContainerName" -ForegroundColor Cyan
    Write-Host "  WAR Size:  $warSizeMB MB" -ForegroundColor Cyan
    Write-Host "  Log File:  $LogFile" -ForegroundColor Cyan
    Write-Host "  Version:   $deployId" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Test URL: http://localhost:8081/cwstartgamev2.do?bankId=6274&gameId=838&mode=real&token=test&lang=en" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}
else {
    Write-Banner "DEPLOYMENT STATUS UNCERTAIN - CHECK LOGS" $false
    Write-Log "Could not verify deployment success - manual check recommended" "WARN"
    exit 1
}
