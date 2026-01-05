# .h5 AI 모델 사용 가이드

## 📋 개요

`.h5` 파일은 Keras/TensorFlow로 학습된 AI 모델 파일입니다. 이 프로젝트에 Python Flask 서비스를 추가하여 모델을 사용할 수 있도록 구성했습니다.

## 🗂️ 생성된 파일 구조

```
factory_complete/
├── ml_service/                    # 새로 생성된 Python ML 서비스
│   ├── models/                    # .h5 파일을 여기에 넣으세요
│   │   └── your_model.h5         # ← 여기에 모델 파일 복사
│   ├── app.py                     # Flask 서버
│   ├── model_loader.py            # 모델 로드 및 예측
│   ├── requirements.txt           # Python 패키지 목록
│   ├── README.md                  # 상세 가이드
│   └── QUICK_START.md             # 빠른 시작 가이드
│
└── backend/                       # Java 백엔드 (수정됨)
    └── src/main/java/com/factory/
        ├── controller/
        │   └── MLController.java  # ML API 엔드포인트
        ├── service/
        │   └── MLService.java     # Python 서비스 호출
        ├── dto/
        │   ├── MLPredictionRequest.java
        │   └── MLPredictionResponse.java
        └── config/
            └── RestTemplateConfig.java
```

## 🚀 빠른 시작

### 1. 모델 파일 준비
`.h5` 파일을 `ml_service/models/` 폴더에 복사하고, 파일명을 `model_loader.py`에서 수정하세요.

### 2. Python 서비스 실행
```bash
cd ml_service
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python app.py
```

### 3. Java 백엔드 실행
```bash
cd backend
mvn spring-boot:run
```

## 📡 API 사용법

### Python 서비스 직접 호출
```bash
# 모델 정보
GET http://localhost:5000/api/model/info

# 예측
POST http://localhost:5000/api/predict
Content-Type: application/json
{
  "data": [1.0, 2.0, 3.0, ...]
}
```

### Java 백엔드 통해 호출 (인증 필요)
```bash
# 모델 정보
GET http://localhost:8080/api/ml/model/info
Authorization: Bearer {JWT_TOKEN}

# 예측
POST http://localhost:8080/api/ml/predict
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
{
  "data": [1.0, 2.0, 3.0, ...]
}
```

## ⚙️ 설정

### Python 서비스 포트 변경
`app.py`의 마지막 줄:
```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

### Java에서 Python 서비스 URL 변경
`backend/src/main/resources/application.yml`:
```yaml
ml:
  service:
    url: http://localhost:5000
```

## 🔧 모델 입력 형식 맞추기

모델의 입력 형식에 따라 `model_loader.py`의 `predict()` 함수를 수정해야 합니다:

- **1D 벡터**: `(batch_size, features)`
- **이미지**: `(batch_size, height, width, channels)`
- **시계열**: `(batch_size, time_steps, features)`

## 📚 더 자세한 내용

- `ml_service/README.md` - 상세한 사용 가이드
- `ml_service/QUICK_START.md` - 빠른 시작 가이드

## ⚠️ 주의사항

1. **모델 파일 크기**: `.h5` 파일은 보통 크기가 크므로 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)
2. **입력 형식**: 모델의 입력 형식에 맞게 데이터를 전달해야 합니다
3. **인증**: Java 백엔드의 ML API는 JWT 토큰이 필요합니다 (로그인 후 받은 토큰 사용)

## 🐛 문제 해결

### 모델 파일을 찾을 수 없습니다
→ `ml_service/models/` 폴더에 `.h5` 파일이 있는지 확인하고, `model_loader.py`의 파일명을 수정하세요.

### Python 서비스가 시작되지 않습니다
→ Python 3.8 이상이 설치되어 있는지 확인하고, `pip install -r requirements.txt`로 패키지를 설치하세요.

### 예측 결과가 이상합니다
→ 모델의 입력 형식(shape, dtype)을 확인하고 `model_loader.py`의 reshape 로직을 수정하세요.

