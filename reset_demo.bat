@echo off
chcp 65001 >nul
echo ==================================================================
echo [CTECH CANTEEN MIS] ĐANG KHÔI PHỤC CSDL DEMO CHUẨN...
echo ==================================================================
python -m backend.app.reset_demo
echo.
pause
