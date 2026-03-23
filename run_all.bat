@echo off
REM ------------------------------------------------------------
REM  Run both the Python AI service (FastAPI) and the Spring Boot
REM  backend on Windows without typing commands.
REM ------------------------------------------------------------

REM ---- Python service ------------------------------------------------
cd /d "%~dp0ai-service"

REM Create virtual environment if it does not exist
if not exist venv (
    python -m venv venv
)

call venv\Scripts\activate.bat

REM Install required packages (only runs if needed)
python -m pip install --upgrade pip setuptools wheel && pip install -r requirements.txt

REM Start the FastAPI server in a new console window
start "Python AI Service" cmd /k "set PYTHONPATH=%cd%\src && cd src\api && ..\..\venv\Scripts\activate.bat && uvicorn ml_service:app --host 0.0.0.0 --port 5000 --reload"

REM ---- Spring Boot backend -------------------------------------------
cd /d "%~dp0backend\vision-app-backend"

REM Start Spring Boot in a new console window
start "Spring Boot Backend" cmd /k ".\\mvnw spring-boot:run"

echo All services have been launched in separate windows.
echo Close the windows when you want to stop the services.
pause
