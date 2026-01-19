$projectDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version"
$deployDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"

Write-Host "Starting Maven Build in Docker..."
# Run Maven build in a container, mounting the source code to /app
# Mounting maven-repo volume to cache dependencies
docker run --rm -v "${projectDir}:/app" -v "maven-repo:/root/.m2" -w /app maven:3.6-jdk-8 mvn install -DskipTests -pl game-server/web-gs -am

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build Successful!"
    
    # Locate the WAR file
    $warFile = Get-ChildItem "$projectDir\game-server\web-gs\target\*.war" | Select-Object -First 1
    
    if ($warFile) {
        Write-Host "Found WAR: $($warFile.FullName)"
        Write-Host "Size: $($warFile.Length) bytes"
        
        Write-Host "Deploying to $deployDir\ROOT.war..."
        Copy-Item $warFile.FullName -Destination "$deployDir\ROOT.war" -Force
        
        Write-Host "Restarting Game Server..."
        docker-compose -f "$projectDir\deploy\docker\GP3\docker-compose.yml" restart gs
        
        Write-Host "Done!"
    }
    else {
        Write-Host "Error: WAR file not found after build!"
    }
}
else {
    Write-Host "Build Failed!"
    exit 1
}
