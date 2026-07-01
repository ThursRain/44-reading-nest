@echo off
setlocal

set "REPO_URL=https://github.com/ThursRain/44-reading-nest.git"
set "SOURCE_DIR=%~dp0"
set "WORK_DIR=%TEMP%\44-reading-nest-deploy"
set "BUNDLED_GIT=C:\Users\16378\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"

where git >nul 2>nul
if errorlevel 1 (
  if exist "%BUNDLED_GIT%" (
    set "GIT_EXE=%BUNDLED_GIT%"
  ) else (
    echo Git was not found.
    echo Please upload index.html on github.com manually.
    pause
    exit /b 1
  )
) else (
  set "GIT_EXE=git"
)

echo.
echo Uploading 44 Reading Nest to:
echo %REPO_URL%
echo.

if exist "%WORK_DIR%" rmdir /s /q "%WORK_DIR%"

"%GIT_EXE%" clone "%REPO_URL%" "%WORK_DIR%"
if errorlevel 1 (
  echo.
  echo Clone failed. Please check network or GitHub login.
  pause
  exit /b 1
)

copy /y "%SOURCE_DIR%index.html" "%WORK_DIR%\index.html" >nul
copy /y "%SOURCE_DIR%README.md" "%WORK_DIR%\README.md" >nul
copy /y "%SOURCE_DIR%.nojekyll" "%WORK_DIR%\.nojekyll" >nul

cd /d "%WORK_DIR%"
"%GIT_EXE%" config user.name "44 Reading Nest"
"%GIT_EXE%" config user.email "44-reading-nest@example.local"
"%GIT_EXE%" add index.html README.md .nojekyll
"%GIT_EXE%" commit -m "Update 44 reading nest"
if errorlevel 1 (
  echo.
  echo No new changes to commit, or commit failed.
)

"%GIT_EXE%" push origin main
if errorlevel 1 (
  echo.
  echo Push failed. If GitHub asks you to sign in, finish login and run this file again.
  pause
  exit /b 1
)

echo.
echo Done. Wait 1-3 minutes, then open:
echo https://thursrain.github.io/44-reading-nest/
echo.
pause
