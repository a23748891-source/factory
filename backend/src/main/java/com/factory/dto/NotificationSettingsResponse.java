package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingsResponse {
    private Long id;
    private String userId;
    private Boolean emergencyEnabled;
    private Boolean emergencySoundEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

