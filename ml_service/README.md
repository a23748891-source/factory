# AI 모델 서비스 (.h5 파일 사용 가이드)

## .h5 파일이란?
- Keras/TensorFlow로 학습된 모델 파일
- HDF5 형식으로 저장된 신경망 모델

## 사용 방법

### 옵션 1: Python Flask/FastAPI 서비스 (추천)
Java 백엔드와 별도로 Python 서비스를 실행하여 모델을 사용합니다.

### 옵션 2: TensorFlow Java
Java에서 직접 모델을 로드합니다 (복잡함).

---

## 옵션 1 구현: Python Flask 서비스

### 1. 모델 파일 위치
```
ml_service/
├── models/
│   └── your_model.h5    # 여기에 .h5 파일을 넣으세요
├── app.py               # Flask 서버
├── model_loader.py      # 모델 로드 및 예측
└── requirements.txt     # 필요한 패키지
```

### 2. 설치 및 실행

```bash
# Python 가상환경 생성
cd ml_service
python -m venv venv

# 가상환경 활성화 (Windows)
venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

### 3. API 엔드포인트

#### 모델 정보 조회
```bash
GET http://localhost:5000/api/model/info
```

#### 예측 요청
```bash
POST http://localhost:5000/api/predict
Content-Type: application/json

{
  "data": [1.0, 2.0, 3.0, ...]  # 모델에 맞는 입력 데이터
}
```

### 4. Java 백엔드에서 호출

`MicrophoneController.java` 또는 새로운 `MLController.java`에서:

```java
@Autowired
private RestTemplate restTemplate;

public String predict(List<Double> inputData) {
    String url = "http://localhost:5000/api/predict";
    Map<String, Object> request = Map.of("data", inputData);
    
    ResponseEntity<Map> response = restTemplate.postForEntity(
        url, request, Map.class
    );
    
    return response.getBody().get("prediction").toString();
}
```

---

## 모델 파일 준비

1. `.h5` 파일을 `ml_service/models/` 폴더에 복사
2. `model_loader.py`에서 모델 경로 수정
3. 모델의 입력/출력 형식에 맞게 코드 수정

---

## 주의사항

- 모델 파일 크기가 클 수 있으므로 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
- 프로덕션에서는 모델 파일을 안전한 위치에 저장하세요
- 모델의 입력 형식(shape, dtype)을 확인하고 맞춰주세요

