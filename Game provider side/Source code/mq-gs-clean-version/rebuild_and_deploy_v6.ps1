$ErrorActionPreference = "Stop"

$localCommonExecutorServicePath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\utils\src\main\java\com\dgphoenix\casino\common\util\CommonExecutorService.java"
$localConfigPath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs\src\main\java\com\dgphoenix\casino\gs\GameServerComponentsConfiguration.java"

$containerCommonExecutorServicePath = "/app/utils/src/main/java/com/dgphoenix/casino/common/util/CommonExecutorService.java"
$containerConfigPath = "/app/game-server/common-gs/src/main/java/com/dgphoenix/casino/gs/GameServerComponentsConfiguration.java"
$localCommonPomsPath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs\pom.xml"
$localWebPomsPath = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\web-gs\pom.xml"

$containerName = "temp_debug_builder"
$warLocalPath = "deployment_artifact_v6.war"
$webAppsDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"
$monitorLog = "startup_monitor_v6.log"

Write-Host "Updating CommonExecutorService.java in builder container..."
docker cp "$localCommonExecutorServicePath" "$containerName`:$containerCommonExecutorServicePath"

Write-Host "Updating GameServerComponentsConfiguration.java in builder container..."
docker cp "$localConfigPath" "$containerName`:$containerConfigPath"

Write-Host "Updating POM files in builder container..."
docker cp "$localCommonPomsPath" "$containerName`:/app/game-server/common-gs/pom.xml"
docker cp "$localWebPomsPath" "$containerName`:/app/game-server/web-gs/pom.xml"

# Must build utils because CommonExecutorService changed
Write-Host "Running Maven Build (gsn-utils-restricted only)..."
# In root pom, module is 'utils' (dir name) but artifactId is 'gsn-utils-restricted'.
# -pl argument usually takes module directory path relative to current dir, or artifactId if ambiguous?
# Actually -pl takes [groupId]:[artifactId] OR relative path.
# Root pom modules entry says <module>utils</module>. So path is 'utils'.
# Dependency hierarchy: web-gs -> common-gs -> various -> utils
docker exec -w /app $containerName mvn clean install -DskipTests -pl utils -am

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build of utils failed."
}

# Now separate build for common-gs to ensure changes there are picked up and installed
Write-Host "Running Maven Build (common-gs only)..."
docker exec -w /app $containerName mvn clean install -DskipTests -pl game-server/common-gs

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build of common-gs failed."
}

# Now build web-gs
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
docker-compose -f "deploy/docker/GP3/docker-compose.yml" logs --tail 500 gs > $monitorLog
Write-Host "Logs dumped to $monitorLog"
