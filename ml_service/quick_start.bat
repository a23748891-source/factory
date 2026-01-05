@echo off
REM Windows 배치 파일: 가상환경 활성화 및 서버 실행

echo ========================================
echo Python ML 서비스 시작
echo ========================================
echo.

REM 가상환경이 없으면 생성
if not exist "venv" (
    echo 가상환경 생성 중...
    python -m venv venv
)

REM 가상환경 활성화
echo 가상환경 활성화 중...
call venv\Scripts\activate.bat

REM 패키지 설치 확인
echo.
echo 패키지 설치 확인 중...
pip install -r requirements.txt

echo.
echo ========================================
echo 서버 시작 중...
echo ========================================
echo.

REM 서버 실행
python app.py

pause

