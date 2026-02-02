$ErrorActionPreference = "Stop"
$clientRoot = "E:\Dev\Igaming Project\Game provider side\Source code\mq-client-clean-version"
$staticTarget = "E:\Dev\Igaming Project\deploy\static\html5pc\actiongames\dragonstone\game"

Write-Host ">>> Building Dragonstone Client (Fast)..."
Set-Location "$clientRoot\dragonstone\game"

if (Test-Path "node_modules\.cache") { 
    Write-Host "Cleaning .cache..."
    Remove-Item "node_modules\.cache" -Recurse -Force 
}
if (Test-Path "dist\build") { 
    Write-Host "Cleaning dist\build..."
    Remove-Item "dist\build" -Recurse -Force 
}

cmd /c npm run build
if ($LASTEXITCODE -ne 0) { throw "Client build failed" }

Write-Host ">>> Deploying Dragonstone Client Files..."
if (!(Test-Path $staticTarget)) {
    New-Item -ItemType Directory -Path $staticTarget -Force
}
Copy-Item "$clientRoot\dragonstone\game\dist\build\*" $staticTarget -Recurse -Force

Write-Host ">>> CLIENT REBUILD COMPLETE <<<"
