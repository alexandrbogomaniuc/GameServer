$logFile = "startup_check.log"
docker-compose -f "deploy/docker/GP3/docker-compose.yml" logs --tail 100 gs > $logFile
Get-Content $logFile -Tail 20
