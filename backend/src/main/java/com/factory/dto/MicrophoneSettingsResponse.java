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
public class MicrophoneSettingsResponse {
    private Long id;
    private String userId;
    private String inputDevice;
    private String outputDevice;
    private Integer inputVolume;
    private Integer outputVolume;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

