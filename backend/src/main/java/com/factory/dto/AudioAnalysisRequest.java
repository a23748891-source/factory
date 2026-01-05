package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioAnalysisRequest {
    private List<Double> audioData; // 오디오 샘플 데이터
    private Integer sampleRate;    // 샘플링 레이트 (예: 16000, 44100)
    private Integer duration;      // 녹음 시간 (밀리초)
}

