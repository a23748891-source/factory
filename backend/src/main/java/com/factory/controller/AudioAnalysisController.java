package com.factory.controller;

import com.factory.dto.AudioAnalysisRequest;
import com.factory.dto.AudioAnalysisResponse;
import com.factory.dto.ErrorResponse;
import com.factory.service.AudioAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audio")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AudioAnalysisController {
    
    private final AudioAnalysisService audioAnalysisService;
    
    /**
     * 오디오 데이터를 분석하여 위험 여부를 판단합니다.
     * 
     * POST /api/audio/analyze
     * {
     *   "audioData": [0.1, 0.2, 0.3, ...],
     *   "sampleRate": 16000,
     *   "duration": 1000
     * }
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAudio(@RequestBody AudioAnalysisRequest request) {
        try {
            if (request.getAudioData() == null || request.getAudioData().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("오디오 데이터가 필요합니다."));
            }
            
            AudioAnalysisResponse response = audioAnalysisService.analyzeAudio(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(response.getError()));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("오디오 분석 중 오류 발생: " + e.getMessage()));
        }
    }
}

