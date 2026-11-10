@echo off
title Geo Music iOS — Local Server
cd /d "%~dp0"
echo ===================================================
echo   Geo Music Player — iOS Ready Server
echo ===================================================
echo Open the IP link shown below in iPhone Safari,
echo then tap Share ^> Add to Home Screen!
echo.
node server.js
pause
