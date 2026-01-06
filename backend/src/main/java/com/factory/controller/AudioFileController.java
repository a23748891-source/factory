package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.entity.AudioFile;
import com.factory.service.AudioFileService;
import com.factory.service.StorageSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/audio-files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class AudioFileController {
    
    private final AudioFileService audioFileService;
    private final StorageSettingsService storageSettingsService;
    
    /**
     * 오디오 파일 저장
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAudioFile(
            @AuthenticationPrincipal String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileName") String fileName) {
        try {
            // 자동 저장이 활성화되어 있는지 확인
            Boolean autoSaveEnabled = storageSettingsService.isAutoSaveEnabled(userId);
            if (!autoSaveEnabled) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("자동 저장이 비활성화되어 있습니다"));
            }
            
            AudioFile audioFile = audioFileService.saveAudioFile(userId, file, fileName);
            return ResponseEntity.ok(audioFile);
        } catch (Exception e) {
            log.error("오디오 파일 저장 실패", e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("파일 저장 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 오디오 파일 저장 (Blob 데이터로)
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveAudioFile(
            @AuthenticationPrincipal String userId,
            @RequestBody SaveAudioRequest request) {
        try {
            // 자동 저장이 활성화되어 있는지 확인
            Boolean autoSaveEnabled = storageSettingsService.isAutoSaveEnabled(userId);
            if (!autoSaveEnabled) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("자동 저장이 비활성화되어 있습니다"));
            }
            
            // Base64 디코딩
            byte[] audioData = java.util.Base64.getDecoder().decode(request.getAudioData());
            AudioFile audioFile = audioFileService.saveAudioFileFromBlob(userId, audioData, request.getFileName());
            return ResponseEntity.ok(audioFile);
        } catch (Exception e) {
            log.error("오디오 파일 저장 실패", e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("파일 저장 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 사용자의 오디오 파일 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<?> getUserAudioFiles(@AuthenticationPrincipal String userId) {
        try {
            List<AudioFile> files = audioFileService.getUserAudioFiles(userId);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("파일 목록 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 오디오 파일 다운로드
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadAudioFile(
            @AuthenticationPrincipal String userId,
            @PathVariable Long fileId) {
        try {
            AudioFile audioFile = audioFileService.getAudioFile(fileId, userId);
            Path filePath = Paths.get(audioFile.getFilePath());
            Resource resource = new FileSystemResource(filePath);
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
            } catch (IOException e) {
                log.warn("파일 타입 확인 실패", e);
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + audioFile.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            log.error("파일 다운로드 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 오디오 파일 삭제
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteAudioFile(
            @AuthenticationPrincipal String userId,
            @PathVariable Long fileId) {
        try {
            audioFileService.deleteAudioFile(fileId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("파일 삭제 실패: " + e.getMessage()));
        }
    }
    
    // 내부 클래스
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SaveAudioRequest {
        private String audioData; // Base64 인코딩된 오디오 데이터
        private String fileName;
    }
}

