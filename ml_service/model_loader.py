"""
AI 모델 로더 및 예측 함수
.h5 파일을 로드하고 예측을 수행합니다.
"""

import os
import numpy as np
from tensorflow import keras
from tensorflow.keras.models import load_model
import librosa

# 모델 파일 경로 (사용자가 추가한 final.h5 사용)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'final.h5')

# 전역 변수로 모델 저장 (한 번만 로드)
_model = None


def load_ai_model():
    """
    .h5 모델 파일을 로드합니다.
    첫 호출 시에만 로드하고, 이후에는 캐시된 모델을 반환합니다.
    """
    global _model
    
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"모델 파일을 찾을 수 없습니다: {MODEL_PATH}\n"
                f"models/ 폴더에 .h5 파일을 넣어주세요."
            )
        
        print(f"모델 로딩 중: {MODEL_PATH}")
        _model = load_model(MODEL_PATH)
        print("모델 로드 완료!")
        
        # 모델 정보 출력
        print(f"입력 shape: {_model.input_shape}")
        print(f"출력 shape: {_model.output_shape}")
    
    return _model


def get_model_info():
    """
    모델의 정보를 반환합니다.
    """
    model = load_ai_model()
    
    return {
        "input_shape": model.input_shape,
        "output_shape": model.output_shape,
        "model_type": type(model).__name__,
        "layers_count": len(model.layers),
        "total_params": model.count_params()
    }


def audio_to_mel_spectrogram(audio_data, sample_rate=16000, n_mels=128, n_fft=2048, hop_length=512, duration=2.0):
    """
    오디오 데이터를 Mel Spectrogram으로 변환합니다.
    
    Args:
        audio_data: 오디오 샘플 데이터 (numpy array 또는 list)
        sample_rate: 샘플링 레이트 (기본값: 16000)
        n_mels: Mel bin 개수 (기본값: 128)
        n_fft: FFT 윈도우 크기 (기본값: 2048)
        hop_length: Hop length (기본값: 512)
        duration: 오디오 길이 (초, 기본값: 2.0)
    
    Returns:
        Mel Spectrogram (numpy array) - shape: (128, 63, 1)
    """
    import numpy as np
    
    # 리스트를 numpy array로 변환
    if isinstance(audio_data, list):
        audio_data = np.array(audio_data, dtype=np.float32)
    
    # 오디오 길이 확인 및 조정 (2초 = 32000 샘플 @ 16kHz)
    target_length = int(sample_rate * duration)
    
    if len(audio_data) > target_length:
        # 다운샘플링: 처음 2초만 사용
        audio_data = audio_data[:target_length]
    elif len(audio_data) < target_length:
        # 패딩: 부족한 부분을 0으로 채움
        padding = np.zeros(target_length - len(audio_data), dtype=np.float32)
        audio_data = np.concatenate([audio_data, padding])
    
    # 정규화 (-1.0 ~ 1.0 범위로)
    max_val = np.max(np.abs(audio_data))
    if max_val > 0:
        audio_data = audio_data / max_val
    
    # Mel Spectrogram 생성
    mel_spec = librosa.feature.melspectrogram(
        y=audio_data,
        sr=sample_rate,
        n_mels=n_mels,
        n_fft=n_fft,
        hop_length=hop_length,
        fmax=sample_rate // 2
    )
    
    # dB 스케일로 변환
    mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
    
    # 정규화 (-80 ~ 0 dB 범위를 0 ~ 1로 변환)
    mel_spec_db = (mel_spec_db + 80) / 80.0
    mel_spec_db = np.clip(mel_spec_db, 0.0, 1.0)
    
    # (128, 63) -> (128, 63, 1)로 변환 (채널 차원 추가)
    mel_spec_db = np.expand_dims(mel_spec_db, axis=-1)
    
    return mel_spec_db


def predict(input_data, sample_rate=16000):
    """
    모델을 사용하여 예측을 수행합니다.
    
    Args:
        input_data: 오디오 데이터 (list 또는 numpy array) - 시간 도메인
        sample_rate: 샘플링 레이트 (기본값: 16000)
    
    Returns:
        예측 결과 (list) - None이나 NaN이 포함되지 않은 깨끗한 리스트
    """
    import numpy as np
    
    try:
        model = load_ai_model()
        
        # 입력 데이터 검증
        if input_data is None:
            raise ValueError("입력 데이터가 None입니다")
        
        if isinstance(input_data, list):
            if len(input_data) == 0:
                raise ValueError("입력 데이터가 비어있습니다")
            audio_data = np.array(input_data, dtype=np.float32)
        else:
            audio_data = np.array(input_data, dtype=np.float32)
        
        # NaN이나 Inf 값 체크
        if np.any(np.isnan(audio_data)) or np.any(np.isinf(audio_data)):
            raise ValueError("입력 데이터에 NaN이나 Inf 값이 포함되어 있습니다")
        
        # 오디오 데이터를 Mel Spectrogram으로 변환
        mel_spec = audio_to_mel_spectrogram(audio_data, sample_rate=sample_rate)
        
        # 모델 입력 형식: (1, 128, 63, 1) - 배치 차원 추가
        mel_spec = np.expand_dims(mel_spec, axis=0)
        
        # 예측 수행
        predictions = model.predict(mel_spec, verbose=0)
        
        # NaN이나 Inf 값 체크
        if np.any(np.isnan(predictions)) or np.any(np.isinf(predictions)):
            raise ValueError("예측 결과에 NaN이나 Inf 값이 포함되어 있습니다")
        
        # 결과를 리스트로 변환 (JSON 직렬화를 위해)
        # 배치 예측의 경우 첫 번째 결과만 반환 (단일 예측 결과)
        if len(predictions.shape) == 1:
            # 1D 배열인 경우 그대로 반환
            result = predictions.tolist()
        else:
            # 2D 이상 배열인 경우 첫 번째 결과만 반환
            # 예: (1, 7) -> (7,) 또는 (2, 7) -> (7,)
            result = predictions[0].tolist()
        
        # None이나 NaN 값 제거 및 검증
        cleaned_result = []
        for val in result:
            if val is None or (isinstance(val, float) and (np.isnan(val) or np.isinf(val))):
                cleaned_result.append(0.0)  # 기본값으로 0.0 사용
            else:
                cleaned_result.append(float(val))
        
        return cleaned_result
        
    except Exception as e:
        import traceback
        print(f"예측 중 오류 발생: {str(e)}")
        print(traceback.format_exc())
        raise


# 테스트 코드
if __name__ == "__main__":
    try:
        # 모델 정보 확인
        info = get_model_info()
        print("\n=== 모델 정보 ===")
        for key, value in info.items():
            print(f"{key}: {value}")
        
        # 예시: 더미 데이터로 예측 테스트
        # 실제 모델의 입력 형식에 맞게 수정하세요!
        print("\n=== 예측 테스트 ===")
        # 예시 입력 (모델에 맞게 수정 필요)
        dummy_input = np.random.rand(1, *info['input_shape'][1:])
        result = predict(dummy_input)
        print(f"예측 결과: {result}")
        
    except FileNotFoundError as e:
        print(f"오류: {e}")
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()

