@echo off
title Push Student Management System to GitHub
cd /d "%~dp0"

echo ========================================================
echo   Pushing to GitHub:
echo   https://github.com/mohammedthoufiq003-svg/student-management-system33
echo ========================================================
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS! Project uploaded to GitHub successfully!
    echo ========================================================
) else (
    echo ========================================================
    echo   Push encountered an error.
    echo   If GitHub requests credentials, sign in via the browser
    echo   or use a Personal Access Token (PAT) as password.
    echo ========================================================
)
echo.
pause
