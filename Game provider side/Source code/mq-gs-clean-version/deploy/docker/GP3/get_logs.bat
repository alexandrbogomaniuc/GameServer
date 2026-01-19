@echo off
echo Capturing logs from gs-1 container...
docker logs gs-1 > gs_debug_logs.txt 2>&1
echo Logs saved to gs_debug_logs.txt
pause
