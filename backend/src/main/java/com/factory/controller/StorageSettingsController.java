package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.StorageSettingsRequest;
import com.factory.dto.StorageSettingsResponse;
import com.factory.service.StorageSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StorageSettingsController {
    
    private final StorageSettingsService storageSettingsService;
    
    /**
     * 저장 설정 저장
     */
    @PostMapping("/settings")
    public ResponseEntity<?> saveSettings(
            @AuthenticationPrincipal String userId,
            @RequestBody StorageSettingsRequest request) {
        try {
            StorageSettingsResponse response = storageSettingsService.saveSettings(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("설정 저장 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 저장 설정 조회
     */
    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(@AuthenticationPrincipal String userId) {
        try {
            StorageSettingsResponse response = storageSettingsService.getSettings(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("설정 조회 실패: " + e.getMessage()));
        }
    }
}

