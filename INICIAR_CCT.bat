@echo off
title CCT PAGE - Servidor local
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo No se encontro Node.js en esta computadora.
  echo Puedes abrir index.html directamente o instalar Node.js y volver a intentarlo.
  pause
  exit /b 1
)

node server.js
pause

