$ErrorActionPreference = "Stop"

$localSourcePath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs\src\main\java\com\dgphoenix\casino\gs\SharedGameServerComponentsConfiguration.java"
$containerDestPath = "/app/game-server/common-gs/src/main/java/com/dgphoenix/casino/gs/SharedGameServerComponentsConfiguration.java"
$containerName = "temp_debug_builder"
$warLocalPath = "deployment_artifact_v2.war"
$webAppsDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"

Write-Host "Updating source file in builder container..."
docker cp "$localSourcePath" "$containerName`:$containerDestPath"

Write-Host "Running Maven Build (common-gs and web-gs)..."
# We build common-gs because we changed it, and web-gs because it depends on it.
# -am might build common-gs anyway if we just specify web-gs, but being explicit is safer/clearer.
docker exec -w /app $containerName mvn clean install -DskipTests -pl game-server/common-gs, game-server/web-gs -am

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build failed."
}

Write-Host "Copying WAR artifact from container..."
docker cp "$containerName`:/app/game-server/web-gs/target/ROOT.war" $warLocalPath

Write-Host "Deploying WAR..."
Copy-Item $warLocalPath "$webAppsDir\ROOT.war" -Force

Write-Host "Restarting Game Server Container..."
docker-compose -f "deploy/docker/GP3/docker-compose.yml" restart gs

Write-Host "Done. Monitoring logs..."
Start-Sleep -Seconds 5
Get-Content -Path "startup_monitor_v2.log" -ErrorAction SilentlyContinue # Just a placeholder, user will likely check logs manually or I will.
