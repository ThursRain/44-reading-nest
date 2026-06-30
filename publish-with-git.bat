@echo off
setlocal
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo Git was not found on this computer.
  echo Install Git first, or upload these files on github.com manually.
  echo.
  pause
  exit /b 1
)

echo.
echo Paste your GitHub repository HTTPS URL.
echo Example: https://github.com/your-name/44-reading-nest.git
echo.
set /p REPO_URL=Repository URL: 

if "%REPO_URL%"=="" (
  echo No repository URL was entered.
  pause
  exit /b 1
)

git init
git branch -M main
git config user.name >nul 2>nul
if errorlevel 1 git config user.name "44 Reading Nest"
git config user.email >nul 2>nul
if errorlevel 1 git config user.email "44-reading-nest@example.local"
git add .
git commit -m "Deploy 44 reading nest"
git remote remove origin >nul 2>nul
git remote add origin "%REPO_URL%"
git push -u origin main

echo.
echo Done. Now open the GitHub repo Settings - Pages and enable Pages from main / root.
echo.
pause
