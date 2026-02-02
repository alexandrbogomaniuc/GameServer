$ErrorActionPreference = "Stop"

# Paths
$sourceDir = "e:\Dev\Igaming Project\Game provider side\Source code\mq-gs-clean-version"
$deploymentDir = "$sourceDir\deploy\docker\GP3\deployments"
$dockerComposeFile = "$sourceDir\deploy\docker\GP3\docker-compose.yml"
$webappSource = "$sourceDir\game-server\web-gs\src\main\webapp"
$webappTarget = "$deploymentDir\ROOT"

Write-Host "Starting Optimized Exploded Build Process..."

# 1. Build Targeted Lightweight WAR
Write-Host "Running Maven Build (Optimized)..."

docker run --rm `
    -v "${sourceDir}:/app" `
    -v "maven-repo:/root/.m2" `
    -w /app `
    maven:3.9-amazoncorretto-8 `
    sh -c "chmod +x *.sh; ./install-gsn-casino-project.sh; mvn clean package -pl game-server/web-gs -am -DskipTests"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed inside Docker container."
}

# 2. Prepare Exploded Deployment Folder
Write-Host "Preparing deployment folder: $webappTarget"

# Delete old WAR and folder to ensure fresh start
if (Test-Path "$deploymentDir\ROOT.war") { Remove-Item "$deploymentDir\ROOT.war" -Force }
if (Test-Path $webappTarget) { 
    Write-Host "  Clearing existing ROOT folder..."
    Remove-Item $webappTarget -Recurse -Force 
}
New-Item -ItemType Directory -Path $webappTarget | Out-Null

# 3. Extract lightweight WAR content
Write-Host "Extracting app classes and JSPs..."
$warPath = "$sourceDir\game-server\web-gs\target\ROOT.war"
# Use PowerShell to extract
Expand-Archive -Path $warPath -DestinationPath $webappTarget -Force

# 4. Fast Static Asset Overlay using Robocopy
Write-Host "Overlaying heavy static assets..."
$foldersToSync = @("html5pc", "images", "common", "js", "css")
foreach ($folder in $foldersToSync) {
    if (Test-Path "$webappSource\$folder") {
        Write-Host "  Syncing $folder..."
        robocopy "$webappSource\$folder" "$webappTarget\$folder" /E /Z /MT:32 /R:2 /W:5 /NP /NDL /NFL /NJH /NJS | Out-Null
    }
}

# 5. Restart GS container
Write-Host "Restarting GS container..."
docker-compose -f $dockerComposeFile restart gs

Write-Host "Done. Capturing restart logs..."
Start-Sleep -Seconds 10
docker-compose -f $dockerComposeFile logs --tail 200 gs
