$sourceDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version"
$deployDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"
$containerName = "temp_builder_gs"

Write-Host "Cleaning up any old builder..."
docker rm -f $containerName 2>$null

Write-Host "Starting builder container..."
# Use a volume for .m2 to speed up if we run multiple times, though first time will be slow
docker run -d --name $containerName -v "maven-repo:/root/.m2" maven:3.6-jdk-8 sleep 3600

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start builder container."
    exit 1
}

Write-Host "Copying source code to builder (this may take a minute)..."
# Exclude target directories to save time? docker cp doesn't support exclude.
# Just copy the whole thing.
docker cp "$sourceDir" "$containerName`:/app"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to copy source."
    docker rm -f $containerName
    exit 1
}

Write-Host "Running Maven Build..."
docker exec -w /app $containerName mvn clean package -DskipTests -pl game-server/web-gs -am

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build Successful!"
    
    Write-Host "Copying WAR content to host..."
    # Warning: the destination path inside container depends on how 'sourceDir' was copied.
    # docker cp folder target_folder -> target_folder/folder usually.
    # Let's verify structure inside first via ls, or assume /app/mq-gs-clean-version if copied folder
    # Actually docker cp source destination: if destination exists, it copies into it.
    # We copied to /app. 
    # Let's check where it landed.
    
    $checkPath = docker exec $containerName ls /app
    Write-Host "Content of /app: $checkPath"
    
    # If sourceDir name is "mq-gs-clean-version", it likely created /app/mq-gs-clean-version
    # We need to adjust path.
    $innerPath = "/app/mq-gs-clean-version/game-server/web-gs/target"
    
    # Check if we need to adjust
    if ($checkPath -match "mq-gs-clean-version") {
        $innerPath = "/app/mq-gs-clean-version/game-server/web-gs/target"
    }
    else {
        # Maybe it copied contents directly? (d:\...\* to /app) - syntax specific
        # If we passed directory path, it usually creates directory.
        $innerPath = "/app/game-server/web-gs/target"
        # If ls /app showed pom.xml, then it's this.
    }

    # Find war name
    $warName = "gsn-web-gs-1.89.0.war" # Hardcoded based on logs
    
    docker cp "$containerName`:$innerPath/$warName" "$deployDir\ROOT.war"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployed to $deployDir\ROOT.war"
        Write-Host "Restarting Game Server..."
        docker-compose -f "$sourceDir\deploy\docker\GP3\docker-compose.yml" restart gs
        Write-Host "Done."
    }
    else {
        Write-Host "Failed to copy artifact from builder."
        # Debug listing
        docker exec $containerName ls -R /app
    }
}
else {
    Write-Host "Build Failed!"
}

Write-Host "Cleaning up..."
docker rm -f $containerName
