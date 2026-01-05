package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioAnalysisResponse {
    private boolean success;
    private boolean isDangerous;           // 위험 소리 여부
    private Double dangerProbability;     // 위험 확률 (0.0 ~ 1.0)
    private List<Double> predictions;     // 전체 예측 결과 (7개 클래스)
    private Integer predictedClass;       // 예측된 클래스 인덱스
    private String message;               // 메시지
    private String error;                  // 오류 메시지
}

