"""
모델 테스트 스크립트
모델이 제대로 로드되고 작동하는지 확인합니다.
"""

from model_loader import load_ai_model, get_model_info, predict
import numpy as np

print("=" * 60)
print("모델 테스트 시작")
print("=" * 60)

try:
    # 1. 모델 로드
    print("\n[1단계] 모델 로드 중...")
    model = load_ai_model()
    print("✅ 모델 로드 성공!")
    
    # 2. 모델 정보 확인
    print("\n[2단계] 모델 정보 확인...")
    info = get_model_info()
    print("\n📊 모델 정보:")
    print(f"  - 입력 shape: {info['input_shape']}")
    print(f"  - 출력 shape: {info['output_shape']}")
    print(f"  - 모델 타입: {info['model_type']}")
    print(f"  - 레이어 수: {info['layers_count']}")
    print(f"  - 파라미터 수: {info['total_params']:,}")
    
    # 3. 예측 테스트
    print("\n[3단계] 예측 테스트...")
    input_shape = info['input_shape']
    
    # 입력 shape에서 batch dimension 제외
    if len(input_shape) == 1:
        # 단순 스칼라 입력
        sample_size = 1
    else:
        sample_size = np.prod(input_shape[1:])  # batch 제외한 모든 차원의 곱
    
    # 더미 데이터 생성
    dummy_input = np.random.rand(sample_size).tolist()
    print(f"  입력 데이터 크기: {len(dummy_input)}")
    print(f"  입력 데이터 샘플 (처음 5개): {dummy_input[:5]}")
    
    # 예측 수행
    result = predict(dummy_input)
    print(f"  ✅ 예측 성공!")
    print(f"  출력 크기: {len(result) if isinstance(result, list) else 'N/A'}")
    
    if isinstance(result, list):
        if len(result) > 0:
            if isinstance(result[0], list):
                print(f"  출력 shape: [{len(result)}, {len(result[0])}]")
                print(f"  출력 샘플 (첫 번째 결과): {result[0][:5] if len(result[0]) > 5 else result[0]}")
            else:
                print(f"  출력 샘플: {result[:5] if len(result) > 5 else result}")
    
    print("\n" + "=" * 60)
    print("✅ 모든 테스트 통과!")
    print("=" * 60)
    print("\n💡 다음 단계:")
    print("  1. Python 서버 실행: python app.py")
    print("  2. Java 백엔드에서 /api/ml/predict 호출")
    
except FileNotFoundError as e:
    print(f"\n❌ 오류: {e}")
    print("\n해결 방법:")
    print("  - ml_service/models/ 폴더에 final_model.h5 파일이 있는지 확인하세요")
    
except Exception as e:
    print(f"\n❌ 오류 발생: {e}")
    import traceback
    print("\n상세 오류:")
    traceback.print_exc()
    print("\n해결 방법:")
    print("  - 모델의 입력 형식을 확인하고 model_loader.py의 predict() 함수를 수정하세요")
    print("  - TensorFlow/Keras가 제대로 설치되었는지 확인하세요: pip install tensorflow")

