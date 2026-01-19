$ErrorActionPreference = "Stop"

$containerName = "temp_debug_builder"
$warLocalPath = "deployment_artifact_v5.war"
$webAppsDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"
$monitorLog = "startup_monitor_v5.log"

Write-Host "Copying WAR artifact from container..."
docker cp "$containerName`:/app/game-server/web-gs/target/ROOT.war" $warLocalPath

Write-Host "Deploying WAR..."
Copy-Item $warLocalPath "$webAppsDir\ROOT.war" -Force

Write-Host "Restarting Game Server Container..."
docker-compose -f "deploy/docker/GP3/docker-compose.yml" restart gs

Write-Host "Done. Monitoring logs..."
Start-Sleep -Seconds 5
# Using docker logs directly in foreground to capture some output, but dumping to file for review.
# Timeout after 30 seconds of logging to avoid hanging script? No, logs -f runs until stopped.
# We'll valid logs command without -f to just get recent logs, then maybe loop?
# Better: just dump logs and exit script, let user check file.
docker-compose -f "deploy/docker/GP3/docker-compose.yml" logs --tail 500 gs > $monitorLog
Write-Host "Logs dumped to $monitorLog"
