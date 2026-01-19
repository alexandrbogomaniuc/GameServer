$ErrorActionPreference = "Stop"

$localSharedPath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs\src\main\java\com\dgphoenix\casino\gs\SharedGameServerComponentsConfiguration.java"
$localConfigPath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs\src\main\java\com\dgphoenix\casino\gs\GameServerComponentsConfiguration.java"

$containerSharedPath = "/app/game-server/common-gs/src/main/java/com/dgphoenix/casino/gs/SharedGameServerComponentsConfiguration.java"
$containerConfigPath = "/app/game-server/common-gs/src/main/java/com/dgphoenix/casino/gs/GameServerComponentsConfiguration.java"

$containerName = "temp_debug_builder"
$warLocalPath = "deployment_artifact_v4.war"
$webAppsDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"

Write-Host "Updating SharedGameServerComponentsConfiguration.java in builder container..."
docker cp "$localSharedPath" "$containerName`:$containerSharedPath"

Write-Host "Updating GameServerComponentsConfiguration.java in builder container..."
docker cp "$localConfigPath" "$containerName`:$containerConfigPath"

Write-Host "Running Maven Build (common-gs only)..."
docker exec -w /app $containerName mvn clean install -DskipTests -pl game-server/common-gs

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build of common-gs failed."
}

Write-Host "Running Maven Build (web-gs only)..."
docker exec -w /app $containerName mvn clean package -DskipTests -pl game-server/web-gs

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build of web-gs failed."
}

Write-Host "Copying WAR artifact from container..."
docker cp "$containerName`:/app/game-server/web-gs/target/ROOT.war" $warLocalPath

Write-Host "Deploying WAR..."
Copy-Item $warLocalPath "$webAppsDir\ROOT.war" -Force

Write-Host "Restarting Game Server Container..."
docker-compose -f "deploy/docker/GP3/docker-compose.yml" restart gs

Write-Host "Done. Monitoring logs..."
Start-Sleep -Seconds 5
docker-compose -f "deploy/docker/GP3/docker-compose.yml" logs -f gs > startup_monitor_v4.log
