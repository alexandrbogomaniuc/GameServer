# launch.ps1
$ErrorActionPreference = "Continue" # Changed to Continue to see all errors
$LogFile = "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\launch_debug.txt"

Start-Transcript -Path $LogFile -Force

Write-Host "Wrapper: Script started at $(Get-Date)"
Write-Host "Wrapper: Current Location: $(Get-Location)"
Write-Host "Wrapper: User: $env:USERNAME"

try {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RowConfigsDir = Join-Path $ScriptDir "GP3"
    $EnvFile = Join-Path $RowConfigsDir ".env"
    $ComposeFile = Join-Path $RowConfigsDir "docker-compose.yml"

    Write-Host "Starting Docker Environment..."
    Write-Host "Configs Dir: $RowConfigsDir"

    # Check tools
    Write-Host "Checking docker..."
    docker --version
    if ($LASTEXITCODE -ne 0) { throw "Docker not found or failed." }

    Write-Host "Checking docker-compose..."
    docker-compose --version
    if ($LASTEXITCODE -ne 0) { throw "Docker-compose not found or failed." }

    # 1. Load Environment Variables from .env
    if (Test-Path $EnvFile) {
        Write-Host "Loading .env file..."
        Get-Content $EnvFile | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#")) {
                $parts = $line.Split("=", 2)
                if ($parts.Length -eq 2) {
                    $name = $parts[0].Trim()
                    $value = $parts[1].Trim()
                    $value = [System.Environment]::ExpandEnvironmentVariables($value)
                    [Environment]::SetEnvironmentVariable($name, $value, "Process")
                    Write-Host "Set $name = $value"
                }
            }
        }
    }
    else {
        throw ".env file not found at $EnvFile"
    }

    # 2. Run Docker Compose
    if (Test-Path $ComposeFile) {
        Write-Host "Running docker-compose up -d --build..."
        docker-compose --project-name "GP3" -f $ComposeFile up -d --build
        if ($LASTEXITCODE -ne 0) { throw "Docker Compose failed with exit code $LASTEXITCODE" }
    }
    else {
        throw "docker-compose.yml not found at $ComposeFile"
    }

    Write-Host "Docker containers started successfully."
    Write-Host "gs:     http://localhost:81"
    Write-Host "static: http://localhost:80"

}
catch {
    Write-Error "An error occurred: $_"
    exit 1
}
finally {
    Stop-Transcript
}

