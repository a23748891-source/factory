package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.UserResponse;
import com.factory.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    private final AdminService adminService;
    
    /**
     * 모든 사용자 조회
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal String userId) {
        try {
            // 관리자 권한 체크 (간단히 role 확인)
            // 실제로는 SecurityConfig에서 권한 체크를 해야 함
            List<UserResponse> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("사용자 목록 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 사용자 삭제
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String userId,
            @AuthenticationPrincipal String currentUserId) {
        try {
            // 자기 자신은 삭제 불가
            if (userId.equals(currentUserId)) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("자기 자신은 삭제할 수 없습니다"));
            }
            
            adminService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("사용자 삭제 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 사용자 역할 변경
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String userId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String currentUserId) {
        try {
            String role = request.get("role");
            if (role == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("역할이 필요합니다"));
            }
            
            UserResponse user = adminService.updateUserRole(userId, role);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("역할 변경 실패: " + e.getMessage()));
        }
    }
}

