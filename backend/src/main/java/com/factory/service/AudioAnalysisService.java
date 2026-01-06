package com.factory.service;

import com.factory.dto.AudioAnalysisRequest;
import com.factory.dto.AudioAnalysisResponse;
import com.factory.dto.MLPredictionResponse;
import com.factory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AudioAnalysisService {
    
    private final MLService mlService;
    private final EventService eventService;
    private final NotificationService notificationService;
    private final NotificationSettingsService notificationSettingsService;
    private final UserRepository userRepository;
    
    // 클래스 정의 (7개 클래스)
    // 0: normal (정상)
    // 1: scream (비명)
    // 2: help (도움 요청)
    // 3: emergency (비상)
    // 4: background_noise (배경 소음)
    // 5: factory_noise (공장 소음)
    // 6: road_noise (도로 소음)
    
    // 위험 클래스 인덱스 (실제 위험한 소리만 포함)
    private static final int[] DANGER_CLASSES = {1, 2, 3}; // scream, help, emergency만 위험으로 판단
    private static final double DANGER_THRESHOLD = 0.7; // 위험 판단 임계값 (70% 이상 확률일 때만 위험으로 판단)
    private static final double MIN_CONFIDENCE = 0.3; // 최소 신뢰도 (30% 미만이면 정상으로 처리)
    private static final double NORMAL_CLASS_THRESHOLD = 0.5; // 정상 클래스 확률 임계값 (50% 이상이면 정상)
    private static final double NORMAL_CLASS_MIN = 0.25; // 정상 클래스 최소 확률 (25% 미만이면 위험 가능성 높음)
    
    /**
     * 오디오 데이터를 분석하여 위험 여부를 판단합니다.
     * 
     * @param request 오디오 데이터 요청
     * @return 분석 결과
     */
    public AudioAnalysisResponse analyzeAudio(AudioAnalysisRequest request) {
        try {
            // 1. 오디오 데이터를 모델 입력 형식으로 변환
            List<Double> modelInput = convertAudioToModelInput(request);
            
            if (modelInput == null || modelInput.isEmpty()) {
                return AudioAnalysisResponse.builder()
                    .success(false)
                    .error("오디오 데이터 변환 실패")
                    .build();
            }
            
            // 2. AI 모델로 예측 수행
            Integer sampleRate = request.getSampleRate() != null ? request.getSampleRate() : 16000;
            MLPredictionResponse mlResponse = mlService.predict(modelInput, sampleRate);
            
            if (!mlResponse.isSuccess() || mlResponse.getPrediction() == null) {
                return AudioAnalysisResponse.builder()
                    .success(false)
                    .error(mlResponse.getError() != null ? mlResponse.getError() : "예측 실패")
                    .build();
            }
            
            // 3. 예측 결과 분석
            List<Double> predictions = mlResponse.getPrediction();
            
            if (predictions == null || predictions.isEmpty()) {
                return AudioAnalysisResponse.builder()
                    .success(false)
                    .error("예측 결과가 비어있습니다")
                    .build();
            }
            
            // 4. 위험 여부 판단
            int predictedClass = findMaxIndex(predictions);
            double maxProbability = predictions.get(predictedClass);
            double normalClassProbability = predictions.size() > 0 ? predictions.get(0) : 0.0; // 클래스 0 (정상) 확률
            
            // 모든 클래스 확률 로그 출력 (디버깅용)
            log.info("=== AI 예측 결과 ===");
            for (int i = 0; i < predictions.size(); i++) {
                String className = getClassLabel(i);
                log.info("클래스 {} ({}): {}%", i, className, String.format("%.2f", predictions.get(i) * 100));
            }
            log.info("최대 확률 클래스: {} ({}), 확률: {}%", 
                predictedClass, getClassLabel(predictedClass), String.format("%.2f", maxProbability * 100));
            
            // 최소 신뢰도 체크: 확률이 너무 낮으면 정상으로 처리
            if (maxProbability < MIN_CONFIDENCE) {
                log.warn("예측 확률이 너무 낮아 정상으로 처리: 클래스={}, 확률={}%", 
                    predictedClass, String.format("%.2f", maxProbability * 100));
                predictedClass = 0; // 정상 클래스로 강제 설정
                maxProbability = normalClassProbability;
            }
            
            // 위험 판단 로직
            boolean isDangerous = false;
            
            // 1. 정상 클래스(0)의 확률이 높으면 항상 정상
            if (normalClassProbability >= NORMAL_CLASS_THRESHOLD) {
                isDangerous = false;
                predictedClass = 0;
                maxProbability = normalClassProbability;
                log.info("정상 클래스 확률이 높아 정상으로 처리: 정상 확률={}%", 
                    String.format("%.2f", normalClassProbability * 100));
            }
            // 2. 위험 클래스이면서 확률이 임계값 이상일 때만 위험으로 판단
            else if (isDangerClass(predictedClass)) {
                // 위험 클래스인 경우, 다음 조건을 모두 만족해야 위험으로 판단:
                // - 위험 클래스 확률이 임계값(70%) 이상
                // - 정상 클래스 확률이 25% 미만 (정상 소리가 거의 없을 때만)
                if (normalClassProbability < NORMAL_CLASS_MIN && maxProbability >= DANGER_THRESHOLD) {
                    isDangerous = true;
                    log.warn("⚠️ 위험 감지: 클래스={} ({}), 확률={}%, 정상 확률={}%", 
                        predictedClass, getClassLabel(predictedClass), 
                        String.format("%.2f", maxProbability * 100), 
                        String.format("%.2f", normalClassProbability * 100));
                } else {
                    isDangerous = false;
                    log.info("위험 클래스이지만 조건 미충족으로 정상 처리: 위험 클래스={} ({}), 위험 확률={}%, 정상 확률={}%, 임계값={}%", 
                        predictedClass, getClassLabel(predictedClass), 
                        String.format("%.2f", maxProbability * 100), 
                        String.format("%.2f", normalClassProbability * 100), 
                        String.format("%.2f", DANGER_THRESHOLD * 100));
                }
            } else {
                // 정상 클래스(0, 4, 5, 6)인 경우 항상 정상
                isDangerous = false;
                log.info("정상 클래스로 판단: 클래스={} ({})", predictedClass, getClassLabel(predictedClass));
            }
            
            // 위험 확률 계산 (위험 클래스들의 확률 합)
            double dangerProbability = calculateDangerProbability(predictions);
            
            // 위험 감지 시에만 이벤트 생성
            if (isDangerous) {
                createDangerEvent(predictedClass, maxProbability);
            }
            
            return AudioAnalysisResponse.builder()
                .success(true)
                .isDangerous(isDangerous)
                .dangerProbability(dangerProbability)
                .predictions(predictions)
                .predictedClass(predictedClass)
                .message(isDangerous ? 
                    String.format("⚠️ 위험 소리 감지! (클래스: %d, 확률: %.2f%%)", predictedClass, maxProbability * 100) :
                    String.format("✅ 정상 소리 (클래스: %d, 확률: %.2f%%)", predictedClass, maxProbability * 100))
                .build();
                
        } catch (Exception e) {
            log.error("오디오 분석 중 오류 발생", e);
            return AudioAnalysisResponse.builder()
                .success(false)
                .error("오디오 분석 실패: " + e.getMessage())
                .build();
        }
    }
    
    /**
     * 오디오 데이터를 정규화하고 Python ML 서비스로 전달합니다.
     * Mel Spectrogram 변환은 Python ML 서비스에서 수행됩니다.
     * 
     * 모델 요구사항:
     * - 입력: Mel Spectrogram (128, 63, 1)
     * - 샘플링 레이트: 16kHz
     * - 오디오 길이: 2초 (32000 샘플)
     */
    private List<Double> convertAudioToModelInput(AudioAnalysisRequest request) {
        List<Double> audioData = request.getAudioData();
        
        if (audioData == null || audioData.isEmpty()) {
            return null;
        }
        
        // 오디오 데이터를 정규화 (-1.0 ~ 1.0 범위로)
        // Python ML 서비스에서 Mel Spectrogram 변환을 수행하므로,
        // 여기서는 정규화만 수행합니다.
        double maxVal = audioData.stream().mapToDouble(Math::abs).max().orElse(1.0);
        if (maxVal == 0) maxVal = 1.0;
        
        List<Double> normalized = new ArrayList<>();
        for (Double val : audioData) {
            normalized.add(val / maxVal);
        }
        
        // Python ML 서비스에서 2초 길이로 조정하므로,
        // 여기서는 정규화된 원본 데이터를 그대로 반환
        return normalized;
    }
    
    /**
     * 예측 결과에서 최대값의 인덱스를 찾습니다.
     */
    private int findMaxIndex(List<Double> values) {
        int maxIndex = 0;
        double maxValue = values.get(0);
        for (int i = 1; i < values.size(); i++) {
            if (values.get(i) > maxValue) {
                maxValue = values.get(i);
                maxIndex = i;
            }
        }
        return maxIndex;
    }
    
    /**
     * 클래스가 위험 클래스인지 확인합니다.
     */
    private boolean isDangerClass(int classIndex) {
        for (int dangerClass : DANGER_CLASSES) {
            if (classIndex == dangerClass) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 위험 확률을 계산합니다 (위험 클래스들의 확률 합).
     */
    private double calculateDangerProbability(List<Double> predictions) {
        double sum = 0.0;
        for (int dangerClass : DANGER_CLASSES) {
            if (dangerClass < predictions.size()) {
                sum += predictions.get(dangerClass);
            }
        }
        return sum;
    }
    
    /**
     * 위험 감지 시 이벤트와 알림을 생성합니다.
     */
    private void createDangerEvent(int predictedClass, double probability) {
        try {
            String zone = "A동 1층";
            String area = "프레스 구역";
            
            // 클래스별로 다른 타입 설정
            String type;
            String classLabel;
            switch (predictedClass) {
                case 1: // scream
                    type = "scream";
                    classLabel = "비명 소리";
                    break;
                case 2: // help
                    type = "help";
                    classLabel = "도움 요청";
                    break;
                case 3: // emergency
                    type = "emergency";
                    classLabel = "비상 상황";
                    break;
                default:
                    type = "emergency";
                    classLabel = "위험 소리";
            }
            
            String severity = probability > 0.8 ? "high" : probability > 0.5 ? "medium" : "low";
            
            // 클래스별 메시지 생성
            String message = String.format("%s 감지 (확률: %.1f%%)", classLabel, probability * 100);
            
            // 이벤트 생성
            eventService.createEvent(zone, area, type, message, severity);
            
            // 모든 사용자에게 알림 생성 (설정이 활성화된 경우만)
            String title = "⚠️ 위험 소리 감지";
            String notificationMessage = String.format("%s %s에서 %s", zone, area, message);
            String priority = severity;
            
            userRepository.findAll().forEach(user -> {
                try {
                    // 사용자의 비상 알림 설정 확인
                    if (notificationSettingsService.isEmergencyEnabled(user.getUserId())) {
                        notificationService.createNotification(
                            user.getUserId(),
                            type,
                            title,
                            notificationMessage,
                            priority
                        );
                    }
                } catch (Exception e) {
                    log.error("알림 생성 실패 (사용자: {}): {}", user.getUserId(), e.getMessage());
                }
            });
            
            log.info("위험 이벤트 및 알림 생성 완료: {} - {}", zone, message);
            
        } catch (Exception e) {
            log.error("이벤트/알림 생성 실패", e);
        }
    }
    
    /**
     * 클래스 인덱스를 레이블로 변환합니다.
     */
    private String getClassLabel(int classIndex) {
        switch (classIndex) {
            case 0:
                return "정상 소리 (normal)";
            case 1:
                return "비명 소리 (scream)";
            case 2:
                return "도움 요청 (help)";
            case 3:
                return "비상 상황 (emergency)";
            case 4:
                return "배경 소음 (background_noise)";
            case 5:
                return "공장 소음 (factory_noise)";
            case 6:
                return "도로 소음 (road_noise)";
            default:
                return "알 수 없는 클래스";
        }
    }
    
}

