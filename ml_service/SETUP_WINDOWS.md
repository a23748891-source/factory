# Windows PowerShell에서 Python 가상환경 설정 가이드

## 1단계: 가상환경 생성

```powershell
cd ml_service
python -m venv venv
```

## 2단계: 가상환경 활성화

PowerShell에서는 다음 중 하나를 사용하세요:

### 방법 1: Activate.ps1 사용 (권장)
```powershell
.\venv\Scripts\Activate.ps1
```

### 방법 2: 실행 정책 변경 후 활성화
만약 "실행할 수 없는 스크립트" 오류가 나면:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

### 방법 3: activate.bat 사용
```powershell
venv\Scripts\activate.bat
```

## 3단계: 패키지 설치

가상환경이 활성화되면 프롬프트 앞에 `(venv)`가 표시됩니다:
```powershell
(venv) PS C:\Users\...\ml_service> pip install -r requirements.txt
```

## 4단계: 서버 실행

```powershell
python app.py
```

## 문제 해결

### "실행할 수 없는 스크립트" 오류
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Python이 설치되지 않음
- Python 3.8 이상이 필요합니다
- https://www.python.org/downloads/ 에서 다운로드

### 가상환경이 활성화되지 않음
- `venv` 폴더가 제대로 생성되었는지 확인
- `ls venv\Scripts` 명령으로 파일이 있는지 확인

