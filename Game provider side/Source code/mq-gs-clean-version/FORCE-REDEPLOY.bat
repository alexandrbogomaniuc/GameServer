@echo off
echo ============================================
echo FORCE REDEPLOY - This will work for sure
echo ============================================
echo.

echo Step 1: Stop and remove old container...
docker-compose -f "deploy\docker\GP3\docker-compose.yml" down

echo.
echo Step 2: Delete old WAR to force fresh deploy...
del /F "deploy\docker\GP3\deployments\ROOT.war"

echo.
echo Step 3: Building common-gs...
cd "game-server\common-gs"
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo BUILD FAILED!
    pause
    exit /b 1
)

echo.
echo Step 4: Building web-gs and packaging WAR...
cd "..\web-gs"
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo BUILD FAILED!
    pause
    exit /b 1
)

echo.
echo Step 5: Copy fresh WAR...
cd ..\..
copy /Y "game-server\web-gs\target\ROOT.war" "deploy\docker\GP3\deployments\ROOT.war"

echo.
echo Step 6: Show WAR timestamp...
powershell -Command "Get-Item 'deploy\docker\GP3\deployments\ROOT.war' | Select-Object LastWriteTime, Length"

echo.
echo Step 7: Start container with FRESH deploy...
docker-compose -f "deploy\docker\GP3\docker-compose.yml" up -d

echo.
echo Step 8: Waiting 10 seconds for startup...
timeout /t 10

echo.
echo Step 9: Show startup logs...
docker logs gp3-gs-1 --tail 50

echo.
echo ========================================
echo DONE! Check logs above for Build number
echo ========================================
pause
