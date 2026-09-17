@echo off
title Student Management System (Full Stack)
cd /d "%~dp0"

echo =======================================================
echo   Student Management System - Full Stack Launcher
echo =======================================================
echo.

if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found at .venv\Scripts\python.exe
    pause
    exit /b 1
)

echo [1/2] Opening Frontend...
start frontend\index.html

echo [2/2] Starting Django REST Backend on http://127.0.0.1:8000/ ...
echo.
echo Press Ctrl + C to stop the backend server.
echo =======================================================
echo.

.venv\Scripts\python.exe backend\manage.py runserver 127.0.0.1:8000

pause
