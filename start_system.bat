@echo off
setlocal
cd /d "%~dp0"

echo =====================================================================
echo  CTECH CANTEEN MANAGEMENT INFORMATION SYSTEM (MIS DEMO)
echo  Architecture: Python FastAPI (Backend) + React Vite (Frontend)
echo  Database: Neon Cloud PostgreSQL
echo =====================================================================
echo.

echo [1/2] Dang khoi dong Backend FastAPI tai cong 8000...
start "CTECH Backend API" cmd /k "cd /d ""%~dp0"" && python backend\run_backend.py"

echo [2/2] Dang khoi dong Frontend React tai cong 5173...
start "CTECH Frontend UI" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo =====================================================================
echo  Khoi dong hoan tat!
echo  - Backend API Docs: http://127.0.0.1:8000/docs
echo  - Frontend Web UI:  http://localhost:5173
echo =====================================================================
echo.
echo Dang mo trinh duyet...
ping 127.0.0.1 -n 4 >nul
start http://localhost:5173

exit /b 0
