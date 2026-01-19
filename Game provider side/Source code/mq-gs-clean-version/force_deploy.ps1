$webAppsDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"
$artifact = "deployment_artifact_v6.war"

Write-Host "Stopping Server..."
docker-compose -f "deploy/docker/GP3/docker-compose.yml" stop gs

Write-Host "Removing old artifacts..."
Remove-Item "$webAppsDir\ROOT" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$webAppsDir\ROOT.war" -Force -ErrorAction SilentlyContinue

Write-Host "Copying new artifact..."
if (Test-Path $artifact) {
    Copy-Item $artifact "$webAppsDir\ROOT.war" -Force
    Write-Host "Artifact copied."
}
else {
    Write-Error "Artifact $artifact not found!"
    exit 1
}

Write-Host "Starting Server..."
docker-compose -f "deploy/docker/GP3/docker-compose.yml" start gs

Write-Host "Done. Check logs."
