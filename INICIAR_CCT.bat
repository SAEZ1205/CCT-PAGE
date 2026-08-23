@echo off
title CCT PAGE - React + Vite
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo No se encontro Node.js en esta computadora.
  echo Instala Node.js 24 LTS y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo No se encontro npm en esta computadora.
  pause
  exit /b 1
)

for /f %%v in ('node -p "process.versions.node.split('.')[0]"') do set NODE_MAJOR=%%v
if not "%NODE_MAJOR%"=="24" (
  echo ADVERTENCIA: este proyecto esta estandarizado en Node.js 24.x.
  node --version
  echo Puedes continuar, pero usa Node 24 para reproducir CI y produccion.
  echo.
)

if not exist node_modules (
  echo Instalando dependencias bloqueadas por package-lock.json...
  call npm ci --no-audit --no-fund
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias.
    pause
    exit /b 1
  )
)

echo Iniciando CCT PAGE...
call npm run dev
pause
