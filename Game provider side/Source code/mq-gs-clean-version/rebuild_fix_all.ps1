$ErrorActionPreference = "Stop"
$gsRoot = "E:\Dev\Igaming Project\Game provider side\Source code\mq-gs-clean-version"
$clientRoot = "E:\Dev\Igaming Project\Game provider side\Source code\mq-client-clean-version"
$webappDir = "E:\Dev\Igaming Project\Game provider side\Source code\mq-gs-clean-version\deploy\docker\GP3\deployments"
$staticTarget = "E:\Dev\Igaming Project\deploy\static\html5pc\actiongames\dragonstone\game"

Write-Host ">>> Building GS Utils..."
Set-Location "$gsRoot\utils"
cmd /c mvn clean install -DskipTests
if ($LASTEXITCODE -ne 0) { throw "Utils build failed" }

Write-Host ">>> Building GS Common..."
Set-Location "$gsRoot\game-server\common-gs"
cmd /c mvn clean install -DskipTests
if ($LASTEXITCODE -ne 0) { throw "Common-GS build failed" }

Write-Host ">>> Building GS Web (WAR)..."
Set-Location "$gsRoot\game-server\web-gs"
cmd /c mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) { throw "Web-GS build failed" }

Write-Host ">>> Deploying ROOT.war..."
Copy-Item "$gsRoot\game-server\web-gs\target\ROOT.war" "$webappDir\ROOT.war" -Force

Write-Host ">>> Building Dragonstone Client..."
Set-Location "$clientRoot\dragonstone\game"
if (Test-Path "node_modules\.cache") { Remove-Item "node_modules\.cache" -Recurse -Force }
if (Test-Path "dist\build") { Remove-Item "dist\build" -Recurse -Force }
cmd /c npm run build
if ($LASTEXITCODE -ne 0) { throw "Client build failed" }

Write-Host ">>> Deploying Dragonstone Client Files..."
if (!(Test-Path $staticTarget)) {
    Write-Host "Target directory does not exist, creating..."
    New-Item -ItemType Directory -Path $staticTarget -Force
}
Copy-Item "$clientRoot\dragonstone\game\dist\build\*" $staticTarget -Recurse -Force

Write-Host ">>> Restarting Game Server Container..."
Set-Location "$gsRoot\deploy\docker\GP3"
docker-compose restart gs

Write-Host ">>> BUILD AND DEPLOY COMPLETE <<<"
