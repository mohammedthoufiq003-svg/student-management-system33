@echo off
title Student Management - Backend Server
cd /d "%~dp0"
echo ===================================================
echo   Starting Django REST API Backend (Port 8000)...
echo ===================================================
..\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
pause
