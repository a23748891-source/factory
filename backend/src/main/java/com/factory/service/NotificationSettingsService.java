package com.factory.service;

import com.factory.dto.NotificationSettingsRequest;
import com.factory.dto.NotificationSettingsResponse;
import com.factory.entity.NotificationSettings;
import com.factory.repository.NotificationSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSettingsService {
    
    private final NotificationSettingsRepository repository;
    
    public NotificationSettingsResponse getSettings(String userId) {
        Optional<NotificationSettings> settingsOpt = repository.findByUserId(userId);
        
        if (settingsOpt.isPresent()) {
            NotificationSettings settings = settingsOpt.get();
            return NotificationSettingsResponse.builder()
                    .id(settings.getId())
                    .userId(settings.getUserId())
                    .emergencyEnabled(settings.getEmergencyEnabled())
                    .emergencySoundEnabled(settings.getEmergencySoundEnabled())
                    .createdAt(settings.getCreatedAt())
                    .updatedAt(settings.getUpdatedAt())
                    .build();
        } else {
            // 기본 설정으로 생성
            NotificationSettings defaultSettings = NotificationSettings.builder()
                    .userId(userId)
                    .emergencyEnabled(true)
                    .emergencySoundEnabled(true)
                    .build();
            NotificationSettings saved = repository.save(defaultSettings);
            
            return NotificationSettingsResponse.builder()
                    .id(saved.getId())
                    .userId(saved.getUserId())
                    .emergencyEnabled(saved.getEmergencyEnabled())
                    .emergencySoundEnabled(saved.getEmergencySoundEnabled())
                    .createdAt(saved.getCreatedAt())
                    .updatedAt(saved.getUpdatedAt())
                    .build();
        }
    }
    
    @Transactional
    public NotificationSettingsResponse updateSettings(String userId, NotificationSettingsRequest request) {
        Optional<NotificationSettings> settingsOpt = repository.findByUserId(userId);
        
        NotificationSettings settings;
        if (settingsOpt.isPresent()) {
            settings = settingsOpt.get();
            if (request.getEmergencyEnabled() != null) {
                settings.setEmergencyEnabled(request.getEmergencyEnabled());
            }
            if (request.getEmergencySoundEnabled() != null) {
                settings.setEmergencySoundEnabled(request.getEmergencySoundEnabled());
            }
        } else {
            settings = NotificationSettings.builder()
                    .userId(userId)
                    .emergencyEnabled(request.getEmergencyEnabled() != null ? request.getEmergencyEnabled() : true)
                    .emergencySoundEnabled(request.getEmergencySoundEnabled() != null ? request.getEmergencySoundEnabled() : true)
                    .build();
        }
        
        NotificationSettings saved = repository.save(settings);
        
        return NotificationSettingsResponse.builder()
                .id(saved.getId())
                .userId(saved.getUserId())
                .emergencyEnabled(saved.getEmergencyEnabled())
                .emergencySoundEnabled(saved.getEmergencySoundEnabled())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
    
    public boolean isEmergencyEnabled(String userId) {
        Optional<NotificationSettings> settingsOpt = repository.findByUserId(userId);
        if (settingsOpt.isPresent()) {
            return settingsOpt.get().getEmergencyEnabled() != null && settingsOpt.get().getEmergencyEnabled();
        }
        return true; // 기본값: 활성화
    }
    
    public boolean isEmergencySoundEnabled(String userId) {
        Optional<NotificationSettings> settingsOpt = repository.findByUserId(userId);
        if (settingsOpt.isPresent()) {
            return settingsOpt.get().getEmergencySoundEnabled() != null && settingsOpt.get().getEmergencySoundEnabled();
        }
        return true; // 기본값: 활성화
    }
}

