@echo off
title Stop Student Management System
echo Stopping any running Django development server on port 8000...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a
    echo Stopped server process with PID %%a
)

echo Done.
pause
