@echo off
setlocal
cd /d "%~dp0"

start "Flowish Dev Server" powershell -NoExit -Command "Set-Location '%CD%'; npm run dev -- --host 127.0.0.1 --port 4173"
timeout /t 4 >nul
start "" "http://127.0.0.1:4173/"
