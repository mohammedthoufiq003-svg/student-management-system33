@echo off
title Student Management System
cd /d "%~dp0"

echo =======================================================
echo   Student Management System - Local Web Server
echo =======================================================
echo.

if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found at .venv\Scripts\python.exe
    echo Please make sure the virtual environment exists.
    pause
    exit /b 1
)

echo [1/2] Opening browser at http://127.0.0.1:8000/ ...
start http://127.0.0.1:8000/

echo [2/2] Starting Django server...
echo.
echo Server running at: http://127.0.0.1:8000/
echo Press Ctrl + C in this window to stop the server.
echo =======================================================
echo.

.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000

pause
