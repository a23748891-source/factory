package com.factory.service;

import com.factory.dto.StorageSettingsRequest;
import com.factory.dto.StorageSettingsResponse;
import com.factory.entity.StorageSettings;
import com.factory.repository.StorageSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StorageSettingsService {
    
    private final StorageSettingsRepository settingsRepository;
    
    @Transactional
    public StorageSettingsResponse saveSettings(String userId, StorageSettingsRequest request) {
        Optional<StorageSettings> existing = settingsRepository.findByUserId(userId);
        
        StorageSettings settings;
        if (existing.isPresent()) {
            settings = existing.get();
            settings.setAutoSaveEnabled(request.getAutoSaveEnabled() != null ? request.getAutoSaveEnabled() : true);
            settings.setRetentionDays(request.getRetentionDays() != null ? request.getRetentionDays() : 30);
        } else {
            settings = StorageSettings.builder()
                    .userId(userId)
                    .autoSaveEnabled(request.getAutoSaveEnabled() != null ? request.getAutoSaveEnabled() : true)
                    .retentionDays(request.getRetentionDays() != null ? request.getRetentionDays() : 30)
                    .build();
        }
        
        settings = settingsRepository.save(settings);
        return StorageSettingsResponse.from(settings);
    }
    
    public StorageSettingsResponse getSettings(String userId) {
        Optional<StorageSettings> settings = settingsRepository.findByUserId(userId);
        
        if (settings.isPresent()) {
            return StorageSettingsResponse.from(settings.get());
        } else {
            // 기본 설정 반환
            return StorageSettingsResponse.builder()
                    .userId(userId)
                    .autoSaveEnabled(true)
                    .retentionDays(30)
                    .build();
        }
    }
    
    public Boolean isAutoSaveEnabled(String userId) {
        Optional<StorageSettings> settings = settingsRepository.findByUserId(userId);
        return settings.map(StorageSettings::getAutoSaveEnabled).orElse(true);
    }
    
    public Integer getRetentionDays(String userId) {
        Optional<StorageSettings> settings = settingsRepository.findByUserId(userId);
        return settings.map(StorageSettings::getRetentionDays).orElse(30);
    }
}

