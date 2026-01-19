$logFile = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\build_output_root_fixed_2.txt"
$deployStatusFile = "deploy_status_v2.txt"
$deploymentDebugLog = "deployment_debug.log"
$rootDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version"
$targetDir = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\deploy\webapps\gs"

function Log-Debug {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $deploymentDebugLog -Append -Encoding utf8
    Write-Host "$timestamp - $message"
}

Log-Debug "Starting monitoring script..."

while ($true) {
    if (Test-Path $logFile) {
        # Check the last 2000 lines to be safe
        try {
            $content = Get-Content $logFile -Tail 2000 -ErrorAction Stop
        }
        catch {
            Log-Debug "Could not read log file (locked?). Retrying..."
            Start-Sleep -Seconds 5
            continue
        }

        if ($content -match "BUILD SUCCESS") {
            Log-Debug "Build Success Detected!"
            
            # Find the generated WAR file
            $warPath = "$rootDir\game-server\web-gs\target"
            Log-Debug "Searching for WAR in: $warPath"
            
            if (Test-Path $warPath) {
                $warFile = Get-ChildItem "$warPath\*.war" | Select-Object -First 1
                
                if ($warFile) {
                    Log-Debug "Found WAR file: $($warFile.FullName)"
                    
                    # Deploy
                    Log-Debug "Stopping gs container..."
                    docker-compose -f "deploy/docker/GP3/docker-compose.yml" stop gs
                    
                    Log-Debug "Copying WAR file to $targetDir\ROOT.war..."
                    Copy-Item $warFile.FullName -Destination "$targetDir\ROOT.war" -Force
                    
                    Log-Debug "Starting gs container..."
                    docker-compose -f "deploy/docker/GP3/docker-compose.yml" start gs
                    
                    "DEPLOYMENT_COMPLETE" | Out-File -FilePath $deployStatusFile -Force
                    Log-Debug "Deployment Complete. Exiting loop."
                    break
                }
                else {
                    Log-Debug "Error: WAR file not found in target directory!" 
                    # Don't break immediately, maybe it's still being packaged? 
                    # But BUILD SUCCESS usually means it's done. 
                    # Wait a bit and check again?
                    Start-Sleep -Seconds 5
                    # verify again
                    $warFile = Get-ChildItem "$warPath\*.war" | Select-Object -First 1
                    if ($warFile) {
                        Log-Debug "Found WAR file on retry: $($warFile.FullName)"
                        # Proceed to copy... (duplicate logic, simplified for now to just break)
                        Copy-Item $warFile.FullName -Destination "$targetDir\ROOT.war" -Force
                        docker-compose -f "deploy/docker/GP3/docker-compose.yml" restart gs
                        "DEPLOYMENT_COMPLETE" | Out-File -FilePath $deployStatusFile -Force
                        break
                    }
                    Log-Debug "Still no WAR file. Exiting."
                    break
                }
            }
            else {
                Log-Debug "Target directory does not exist: $warPath"
                break
            }
        }
        elseif ($content -match "BUILD FAILURE") {
            Log-Debug "Build Failure Detected."
            "BUILD_FAILED" | Out-File -FilePath $deployStatusFile -Force
            break
        }
    }
    else {
        Log-Debug "Log file not found yet..."
    }
    
    Start-Sleep -Seconds 10
}
