package com.factory.service;

import com.factory.dto.MLPredictionRequest;
import com.factory.dto.MLPredictionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MLService {
    
    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;
    
    private final RestTemplate restTemplate;
    
    /**
     * AI 모델을 사용하여 예측을 수행합니다.
     * 
     * @param inputData 모델 입력 데이터
     * @param sampleRate 샘플링 레이트 (기본값: 16000)
     * @return 예측 결과
     */
    public MLPredictionResponse predict(List<Double> inputData, Integer sampleRate) {
        try {
            String url = mlServiceUrl + "/api/predict";
            
            if (sampleRate == null) {
                sampleRate = 16000;  // 기본값
            }
            
            MLPredictionRequest request = new MLPredictionRequest(inputData, sampleRate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<MLPredictionRequest> entity = new HttpEntity<>(request, headers);
            
            log.info("ML 서비스 호출: {}", url);
            
            // 먼저 Map으로 받아서 수동으로 변환 (유연한 처리)
            ResponseEntity<Map> response = restTemplate.postForEntity(
                url, entity, Map.class
            );
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RuntimeException("ML 서비스 응답이 비어있습니다");
            }
            
            MLPredictionResponse result = new MLPredictionResponse();
            result.setSuccess((Boolean) responseBody.getOrDefault("success", false));
            
            // prediction 필드 처리 (배열이든 중첩 배열이든 처리)
            Object predictionObj = responseBody.get("prediction");
            if (predictionObj != null) {
                if (predictionObj instanceof List) {
                    List<?> predList = (List<?>) predictionObj;
                    // 중첩 배열인 경우 첫 번째 요소 사용
                    if (!predList.isEmpty() && predList.get(0) instanceof List) {
                        List<?> nestedList = (List<?>) predList.get(0);
                        result.setPrediction(nestedList.stream()
                            .filter(obj -> obj != null)  // null 값 필터링
                            .map(obj -> {
                                if (obj instanceof Number) {
                                    return ((Number) obj).doubleValue();
                                }
                                return Double.parseDouble(obj.toString());
                            })
                            .collect(Collectors.toList()));
                    } else {
                        // 단일 배열인 경우
                        result.setPrediction(predList.stream()
                            .filter(obj -> obj != null)  // null 값 필터링
                            .map(obj -> {
                                if (obj instanceof Number) {
                                    return ((Number) obj).doubleValue();
                                }
                                return Double.parseDouble(obj.toString());
                            })
                            .collect(Collectors.toList()));
                    }
                }
            }
            
            // input_shape, output_shape 처리
            if (responseBody.get("input_shape") instanceof List) {
                List<?> inputShape = (List<?>) responseBody.get("input_shape");
                result.setInputShape(inputShape.stream()
                    .filter(obj -> obj != null)  // null 값 필터링
                    .map(obj -> {
                        if (obj instanceof Number) {
                            return ((Number) obj).intValue();
                        }
                        return Integer.parseInt(obj.toString());
                    })
                    .collect(Collectors.toList()));
            }
            
            if (responseBody.get("output_shape") instanceof List) {
                List<?> outputShape = (List<?>) responseBody.get("output_shape");
                result.setOutputShape(outputShape.stream()
                    .filter(obj -> obj != null)  // null 값 필터링
                    .map(obj -> {
                        if (obj instanceof Number) {
                            return ((Number) obj).intValue();
                        }
                        return Integer.parseInt(obj.toString());
                    })
                    .collect(Collectors.toList()));
            }
            
            if (responseBody.get("error") != null) {
                result.setError(responseBody.get("error").toString());
            }
            
            return result;
            
        } catch (RestClientException e) {
            log.error("ML 서비스 호출 실패: {}", e.getMessage(), e);
            MLPredictionResponse errorResponse = new MLPredictionResponse();
            errorResponse.setSuccess(false);
            errorResponse.setError("ML 서비스 연결 실패: " + e.getMessage());
            return errorResponse;
        } catch (Exception e) {
            log.error("ML 서비스 응답 처리 실패: {}", e.getMessage(), e);
            MLPredictionResponse errorResponse = new MLPredictionResponse();
            errorResponse.setSuccess(false);
            errorResponse.setError("ML 서비스 응답 처리 실패: " + e.getMessage());
            return errorResponse;
        }
    }
    
    /**
     * 모델 정보를 조회합니다.
     */
    public Map<String, Object> getModelInfo() {
        try {
            String url = mlServiceUrl + "/api/model/info";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (RestClientException e) {
            log.error("모델 정보 조회 실패: {}", e.getMessage(), e);
            return Map.of("error", "모델 정보 조회 실패: " + e.getMessage());
        }
    }
}

