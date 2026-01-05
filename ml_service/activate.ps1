# PowerShell 가상환경 활성화 스크립트
# 이 파일을 실행하면 가상환경이 활성화됩니다

if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
    Write-Host "가상환경이 활성화되었습니다!" -ForegroundColor Green
    Write-Host "프롬프트 앞에 (venv)가 표시됩니다." -ForegroundColor Yellow
} else {
    Write-Host "오류: 가상환경을 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "먼저 다음 명령을 실행하세요: python -m venv venv" -ForegroundColor Yellow
}

