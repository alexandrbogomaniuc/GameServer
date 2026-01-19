@echo off
echo ========================================
echo Quick rebuild with VERBOSE output
echo ========================================

echo.
echo [Step 1/3] Building common-gs module...
cd /d "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs"
call mvn clean install -DskipTests -X
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo FAILED: common-gs build failed
    pause
    exit /b 1
)

echo.
echo [Step 2/3] Building web-gs module...
cd /d "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\web-gs"
call mvn clean package -DskipTests -X
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo FAILED: web-gs build failed
    pause
    exit /b 1
)

echo.
echo [Step 3/3] Copying ROOT.war to deployments...
copy /Y "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\web-gs\target\ROOT.war" "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\deploy\docker\GP3\deployments\ROOT.war"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo FAILED: WAR copy failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo War file timestamp:
powershell -Command "Get-Item 'deploy\docker\GP3\deployments\ROOT.war' | Select-Object LastWriteTime, Length"
echo.
echo Next: Restart container with:
echo   docker-compose -f deploy/docker/GP3/docker-compose.yml restart gs
echo.
pause
