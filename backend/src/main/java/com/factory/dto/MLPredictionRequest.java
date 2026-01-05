package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionRequest {
    private List<Double> data;
    private Integer sampleRate;  // 샘플링 레이트 (기본값: 16000)
}

