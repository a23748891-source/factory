package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.SystemInfoResponse;
import com.factory.service.SystemInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SystemInfoController {
    
    private final SystemInfoService systemInfoService;
    
    /**
     * 시스템 정보 조회
     */
    @GetMapping("/info")
    public ResponseEntity<?> getSystemInfo() {
        try {
            SystemInfoResponse response = systemInfoService.getSystemInfo();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("시스템 정보 조회 실패: " + e.getMessage()));
        }
    }
}

