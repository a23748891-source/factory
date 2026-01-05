package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.MLPredictionRequest;
import com.factory.dto.MLPredictionResponse;
import com.factory.service.MLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MLController {
    
    private final MLService mlService;
    
    /**
     * AI 모델 예측 API
     * 
     * 요청 예시:
     * POST /api/ml/predict
     * {
     *   "data": [1.0, 2.0, 3.0, ...]
     * }
     */
    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody MLPredictionRequest request) {
        try {
            if (request.getData() == null || request.getData().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("입력 데이터가 필요합니다."));
            }
            
            // 샘플링 레이트 설정 (기본값: 16000)
            Integer sampleRate = request.getSampleRate() != null ? request.getSampleRate() : 16000;
            MLPredictionResponse response = mlService.predict(request.getData(), sampleRate);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(response.getError()));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("예측 중 오류 발생: " + e.getMessage()));
        }
    }
    
    /**
     * 모델 정보 조회 API
     */
    @GetMapping("/model/info")
    public ResponseEntity<?> getModelInfo() {
        try {
            Map<String, Object> info = mlService.getModelInfo();
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("모델 정보 조회 실패: " + e.getMessage()));
        }
    }
}

