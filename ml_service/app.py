"""
Flask 서버: AI 모델 API 엔드포인트 제공
Java 백엔드에서 호출할 수 있는 REST API를 제공합니다.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from model_loader import load_ai_model, get_model_info, predict

app = Flask(__name__)
CORS(app)  # Java 백엔드에서 호출할 수 있도록 CORS 허용


@app.route('/api/health', methods=['GET'])
def health_check():
    """서버 상태 확인"""
    return jsonify({
        "status": "healthy",
        "message": "AI 모델 서비스가 정상 작동 중입니다."
    })


@app.route('/api/model/info', methods=['GET'])
def model_info():
    """모델 정보 조회"""
    try:
        info = get_model_info()
        return jsonify({
            "success": True,
            "data": info
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
    """
    예측 API
    
    요청 형식:
    {
        "data": [1.0, 2.0, 3.0, ...]  # 모델 입력 데이터
    }
    
    응답 형식:
    {
        "success": true,
        "prediction": [...],  # 예측 결과
        "input_shape": [...],
        "output_shape": [...]
    }
    """
    try:
        # 요청 데이터 확인
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": "Content-Type이 application/json이어야 합니다."
            }), 400
        
        data = request.get_json()
        
        if 'data' not in data:
            return jsonify({
                "success": False,
                "error": "요청에 'data' 필드가 필요합니다."
            }), 400
        
        input_data = data['data']
        
        # 입력 데이터 검증
        if not isinstance(input_data, list):
            return jsonify({
                "success": False,
                "error": "입력 데이터는 리스트여야 합니다."
            }), 400
        
        if len(input_data) == 0:
            return jsonify({
                "success": False,
                "error": "입력 데이터가 비어있습니다."
            }), 400
        
        # 샘플링 레이트 추출 (기본값: 16000)
        sample_rate = data.get('sample_rate', 16000)
        if not isinstance(sample_rate, int):
            sample_rate = 16000
        
        # 예측 수행
        try:
            prediction = predict(input_data, sample_rate=sample_rate)
            
            # 예측 결과 검증
            if prediction is None or len(prediction) == 0:
                return jsonify({
                    "success": False,
                    "error": "예측 결과가 비어있습니다."
                }), 500
            
            # 모델 정보도 함께 반환
            info = get_model_info()
            
            return jsonify({
                "success": True,
                "prediction": prediction,
                "input_shape": info.get('input_shape', []),
                "output_shape": info.get('output_shape', [])
            })
        except ValueError as e:
            return jsonify({
                "success": False,
                "error": f"입력 데이터 오류: {str(e)}"
            }), 400
        
    except FileNotFoundError as e:
        return jsonify({
            "success": False,
            "error": f"모델 파일을 찾을 수 없습니다: {str(e)}"
        }), 404
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


@app.route('/api/predict/batch', methods=['POST'])
def predict_batch():
    """
    배치 예측 API (여러 데이터를 한 번에 예측)
    
    요청 형식:
    {
        "data": [
            [1.0, 2.0, 3.0, ...],
            [4.0, 5.0, 6.0, ...],
            ...
        ]
    }
    """
    try:
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": "Content-Type이 application/json이어야 합니다."
            }), 400
        
        data = request.get_json()
        
        if 'data' not in data or not isinstance(data['data'], list):
            return jsonify({
                "success": False,
                "error": "요청에 'data' 필드(리스트)가 필요합니다."
            }), 400
        
        input_data = data['data']
        
        # 배치 예측 수행
        predictions = predict(input_data)
        
        return jsonify({
            "success": True,
            "predictions": predictions,
            "count": len(predictions)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


if __name__ == '__main__':
    print("=" * 50)
    print("AI 모델 서비스 시작 중...")
    print("=" * 50)
    
    # 서버 시작 전 모델 로드 테스트
    try:
        model = load_ai_model()
        print(f"✅ 모델 로드 성공!")
        print(f"   입력 shape: {model.input_shape}")
        print(f"   출력 shape: {model.output_shape}")
    except FileNotFoundError as e:
        print(f"⚠️  경고: {e}")
        print("   models/ 폴더에 .h5 파일을 넣어주세요.")
    except Exception as e:
        print(f"⚠️  경고: 모델 로드 중 오류 발생: {e}")
    
    print("\n서버 시작: http://localhost:5000")
    print("API 엔드포인트:")
    print("  - GET  /api/health")
    print("  - GET  /api/model/info")
    print("  - POST /api/predict")
    print("  - POST /api/predict/batch")
    print("=" * 50)
    
    # 개발 모드로 실행 (프로덕션에서는 gunicorn 등 사용)
    app.run(host='0.0.0.0', port=5000, debug=True)

