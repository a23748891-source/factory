package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.NotificationResponse;
import com.factory.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    /**
     * 사용자의 알림 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getUserNotifications(@AuthenticationPrincipal String userId) {
        try {
            List<NotificationResponse> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("알림 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 읽지 않은 알림 개수 조회
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal String userId) {
        try {
            long count = notificationService.getUnreadCount(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("알림 개수 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 알림을 읽음으로 표시
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        try {
            notificationService.markAsRead(id, userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("알림 읽음 처리 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 모든 알림을 읽음으로 표시
     */
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal String userId) {
        try {
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("알림 읽음 처리 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 알림 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        try {
            notificationService.deleteNotification(id, userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("알림 삭제 실패: " + e.getMessage()));
        }
    }
}

