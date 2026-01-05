package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MicrophoneStatusResponse {
    private String status; // "active" or "inactive"
    private Integer inputLevel; // 0-100
    private Integer outputLevel; // 0-100
    private String device;
    private Boolean isEnabled;
}

