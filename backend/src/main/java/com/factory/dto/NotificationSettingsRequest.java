package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingsRequest {
    private Boolean emergencyEnabled;
    private Boolean emergencySoundEnabled;
}

