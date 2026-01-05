package com.factory.controller;

import com.factory.dto.*;
import com.factory.service.MicrophoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/microphone")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MicrophoneController {
    
    private final MicrophoneService microphoneService;
    
    /**
     * 마이크 설정 저장
     */
    @PostMapping("/settings")
    public ResponseEntity<?> saveSettings(
            @AuthenticationPrincipal String userId,
            @RequestBody MicrophoneSettingsRequest request) {
        try {
            MicrophoneSettingsResponse response = microphoneService.saveSettings(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("설정 저장 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 마이크 설정 조회
     */
    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(@AuthenticationPrincipal String userId) {
        try {
            MicrophoneSettingsResponse response = microphoneService.getSettings(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("설정 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 마이크 상태 조회 (실시간)
     */
    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@AuthenticationPrincipal String userId) {
        try {
            MicrophoneStatusResponse response = microphoneService.getStatus(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("상태 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 사용 가능한 오디오 장치 목록 조회
     */
    @GetMapping("/devices")
    public ResponseEntity<?> getAvailableDevices() {
        try {
            AudioDeviceResponse response = microphoneService.getAvailableDevices();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("장치 목록 조회 실패: " + e.getMessage()));
        }
    }
}

