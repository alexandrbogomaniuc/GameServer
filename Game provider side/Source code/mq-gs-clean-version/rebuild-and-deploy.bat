@echo off
echo ========================================
echo Building utils module...
echo ========================================
cd /d "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\utils"
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: utils build failed
    exit /b 1
)

echo ========================================
echo Building game-server/common-gs...
echo ========================================
cd /d "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\common-gs"
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: common-gs build failed
    exit /b 1
)

echo ========================================
echo Building game-server/web-gs...
echo ========================================
cd /d "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\web-gs"
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: web-gs build failed
    exit /b 1
)

echo ========================================
echo Copying ROOT.war to deployments...
echo ========================================
copy /Y "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\game-server\web-gs\target\ROOT.war" "d:\OneDrive - Roan Solutions, Inc\DOCUMENTS\Igaming Project\Game provider side\Source code\mq-gs-clean-version\deploy\docker\GP3\deployments\ROOT.war"
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: WAR copy failed
    exit /b 1
)

echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo War file deployed to: deployments\ROOT.war
echo Next step: Restart the container
