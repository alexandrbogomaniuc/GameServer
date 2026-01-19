@echo off
set LOGFILE="d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\launch_debug_final.txt"
echo Starting Log > %LOGFILE%
echo Current Dir (Initial): %CD% >> %LOGFILE%

cd /d "%~dp0"
echo Current Dir (After CD): %CD% >> %LOGFILE%

echo Checking docker-compose: >> %LOGFILE%
docker-compose --version >> %LOGFILE% 2>&1

echo Starting Docker Compose... >> %LOGFILE%
docker-compose --verbose --env-file row-configs\.env -f row-configs\docker-compose.yml -p gp3 up -d --build >> %LOGFILE% 2>&1

if %errorlevel% neq 0 (
    echo Docker Compose failed with exit code %errorlevel% >> %LOGFILE%
    exit /b %errorlevel%
)
echo Docker containers started successfully. >> %LOGFILE%
echo gs:     http://localhost:81 >> %LOGFILE%
echo static: http://localhost:80 >> %LOGFILE%
