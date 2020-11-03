@echo off
cd /D "%~dp0"
echo %cd%
echo "Starting check..."
node\node.exe dist\check.js
pause