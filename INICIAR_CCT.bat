@echo off
title CCT PAGE - React + Vite
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo No se encontro Node.js/npm en esta computadora.
  echo Instala Node.js y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias por primera vez...
  call npm install
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias.
    pause
    exit /b 1
  )
)

echo Iniciando CCT PAGE...
call npm run dev
pause
