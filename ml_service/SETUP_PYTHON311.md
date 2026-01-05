# Python 3.11로 가상환경 재생성 가이드

## 문제
Python 3.14.1은 TensorFlow를 지원하지 않습니다.
TensorFlow는 Python 3.8-3.11까지만 지원합니다.

## 해결 방법

### 1. Python 3.11 설치 확인
```powershell
# Python 3.11이 설치되어 있는지 확인
py -3.11 --version
```

### 2. Python 3.11이 없다면 설치
- https://www.python.org/downloads/release/python-3118/ 에서 다운로드
- 또는 Microsoft Store에서 "Python 3.11" 검색

### 3. Python 3.11로 가상환경 재생성
```powershell
# 기존 가상환경 삭제
Remove-Item -Recurse -Force venv

# Python 3.11로 새 가상환경 생성
py -3.11 -m venv venv

# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# 패키지 설치
pip install -r requirements.txt
```

### 4. Python 3.11이 py 명령으로 인식되지 않으면
```powershell
# 전체 경로 사용
C:\Python311\python.exe -m venv venv
```

