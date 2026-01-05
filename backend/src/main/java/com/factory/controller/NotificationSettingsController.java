package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.NotificationSettingsRequest;
import com.factory.dto.NotificationSettingsResponse;
import com.factory.service.NotificationSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification-settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationSettingsController {
    
    private final NotificationSettingsService settingsService;
    
    @GetMapping
    public ResponseEntity<?> getSettings(@AuthenticationPrincipal String userId) {
        try {
            NotificationSettingsResponse response = settingsService.getSettings(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("설정 조회 실패: " + e.getMessage()));
        }
    }
    
    @PutMapping
    public ResponseEntity<?> updateSettings(
            @AuthenticationPrincipal String userId,
            @RequestBody NotificationSettingsRequest request) {
        try {
            NotificationSettingsResponse response = settingsService.updateSettings(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("설정 저장 실패: " + e.getMessage()));
        }
    }
}

