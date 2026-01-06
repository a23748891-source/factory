package com.factory.service;

import com.factory.entity.AudioFile;
import com.factory.repository.AudioFileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AudioFileService {
    
    @Value("${audio.storage.path:./audio_files}")
    private String storagePath;
    
    private final AudioFileRepository audioFileRepository;
    private final StorageSettingsService storageSettingsService;
    
    /**
     * 오디오 파일 저장
     */
    @Transactional
    public AudioFile saveAudioFile(String userId, MultipartFile file, String fileName) throws IOException {
        // 저장 디렉토리 생성
        Path storageDir = Paths.get(storagePath, userId);
        Files.createDirectories(storageDir);
        
        // 고유한 파일명 생성
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path filePath = storageDir.resolve(uniqueFileName);
        
        // 파일 저장
        file.transferTo(filePath.toFile());
        
        // 데이터베이스에 기록
        AudioFile audioFile = AudioFile.builder()
                .userId(userId)
                .fileName(fileName)
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .build();
        
        return audioFileRepository.save(audioFile);
    }
    
    /**
     * 오디오 파일 저장 (Blob 데이터로)
     */
    @Transactional
    public AudioFile saveAudioFileFromBlob(String userId, byte[] audioData, String fileName) throws IOException {
        // 저장 디렉토리 생성
        Path storageDir = Paths.get(storagePath, userId);
        Files.createDirectories(storageDir);
        
        // 고유한 파일명 생성
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path filePath = storageDir.resolve(uniqueFileName);
        
        // 파일 저장
        Files.write(filePath, audioData);
        
        // 데이터베이스에 기록
        AudioFile audioFile = AudioFile.builder()
                .userId(userId)
                .fileName(fileName)
                .filePath(filePath.toString())
                .fileSize((long) audioData.length)
                .build();
        
        return audioFileRepository.save(audioFile);
    }
    
    /**
     * 사용자의 오디오 파일 목록 조회
     */
    public List<AudioFile> getUserAudioFiles(String userId) {
        return audioFileRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * 오디오 파일 삭제
     */
    @Transactional
    public void deleteAudioFile(Long fileId, String userId) throws IOException {
        AudioFile audioFile = audioFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다"));
        
        if (!audioFile.getUserId().equals(userId)) {
            throw new RuntimeException("파일 삭제 권한이 없습니다");
        }
        
        // 파일 시스템에서 삭제
        Path filePath = Paths.get(audioFile.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        // 데이터베이스에서 삭제
        audioFileRepository.delete(audioFile);
    }
    
    /**
     * 오디오 파일 조회
     */
    public AudioFile getAudioFile(Long fileId, String userId) {
        AudioFile audioFile = audioFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다"));
        
        if (!audioFile.getUserId().equals(userId)) {
            throw new RuntimeException("파일 조회 권한이 없습니다");
        }
        
        return audioFile;
    }
    
    /**
     * 보관 기간이 지난 파일 자동 삭제 (스케줄러)
     * 매일 새벽 2시에 실행
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupOldFiles() {
        log.info("오래된 오디오 파일 정리 시작");
        
        try {
            // 모든 사용자에 대해 보관 기간 확인
            List<AudioFile> allFiles = audioFileRepository.findAll();
            int deletedCount = 0;
            
            for (AudioFile file : allFiles) {
                Integer retentionDays = storageSettingsService.getRetentionDays(file.getUserId());
                LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);
                
                if (file.getCreatedAt().isBefore(cutoffDate)) {
                    try {
                        // 파일 시스템에서 삭제
                        Path filePath = Paths.get(file.getFilePath());
                        if (Files.exists(filePath)) {
                            Files.delete(filePath);
                        }
                        
                        // 데이터베이스에서 삭제
                        audioFileRepository.delete(file);
                        deletedCount++;
                        log.debug("오래된 파일 삭제: {}", file.getFileName());
                    } catch (Exception e) {
                        log.error("파일 삭제 실패: {}", file.getFileName(), e);
                    }
                }
            }
            
            log.info("오래된 오디오 파일 정리 완료: {}개 파일 삭제", deletedCount);
        } catch (Exception e) {
            log.error("오래된 파일 정리 중 오류 발생", e);
        }
    }
}

