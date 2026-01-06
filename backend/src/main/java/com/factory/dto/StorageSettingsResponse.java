package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageSettingsResponse {
    private String userId;
    private Boolean autoSaveEnabled;
    private Integer retentionDays;
    
    public static StorageSettingsResponse from(com.factory.entity.StorageSettings settings) {
        return StorageSettingsResponse.builder()
                .userId(settings.getUserId())
                .autoSaveEnabled(settings.getAutoSaveEnabled())
                .retentionDays(settings.getRetentionDays())
                .build();
    }
}

