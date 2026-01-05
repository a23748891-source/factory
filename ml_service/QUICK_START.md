# .h5 모델 사용 빠른 시작 가이드

## 1단계: 모델 파일 준비

`.h5` 파일을 다음 위치에 복사하세요:
```
ml_service/models/your_model.h5
```

## 2단계: 모델 로더 수정

`model_loader.py` 파일을 열어서 모델 파일 이름을 수정하세요:

```python
# 12번째 줄 근처
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'your_model.h5')
#                                                              ^^^^^^^^^^^^^^
#                                                              여기를 실제 파일명으로 변경
```

## 3단계: 모델 입력 형식 확인

모델의 입력 형식을 확인하고 `model_loader.py`의 `predict()` 함수를 수정하세요.

예를 들어:
- 이미지 분류: `(batch_size, height, width, channels)`
- 시계열: `(batch_size, time_steps, features)`
- 단순 벡터: `(batch_size, features)`

## 4단계: Python 서비스 실행

```bash
# ml_service 폴더로 이동
cd ml_service

# 가상환경 생성 (처음 한 번만)
python -m venv venv

# 가상환경 활성화 (Windows)
venv\Scripts\activate

# 패키지 설치 (처음 한 번만)
pip install -r requirements.txt

# 서버 실행
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

## 5단계: 테스트

### Python 서비스 테스트
```bash
# 모델 정보 확인
curl http://localhost:5000/api/model/info

# 예측 테스트
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d "{\"data\": [1.0, 2.0, 3.0]}"
```

### Java 백엔드에서 호출
Java 백엔드가 실행 중이면:
```bash
# JWT 토큰 필요 (로그인 후 받은 토큰)
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"data\": [1.0, 2.0, 3.0]}"
```

## 문제 해결

### 모델 파일을 찾을 수 없습니다
- `ml_service/models/` 폴더에 `.h5` 파일이 있는지 확인
- `model_loader.py`의 `MODEL_PATH`가 올바른지 확인

### 입력 shape 오류
- 모델의 입력 형식을 확인하세요
- `model_loader.py`의 `predict()` 함수에서 reshape 로직을 수정하세요

### Python 패키지 설치 오류
- Python 3.8 이상이 필요합니다
- TensorFlow는 Windows에서 설치가 까다로울 수 있습니다
- GPU가 있다면 `tensorflow-gpu`를 사용할 수 있습니다

