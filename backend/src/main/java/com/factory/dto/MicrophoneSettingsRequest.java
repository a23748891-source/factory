package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MicrophoneSettingsRequest {
    private Boolean enabled;
    private String mode; // "always" or "scheduled"
    private String scheduleStart;
    private String scheduleEnd;
    private String inputDevice;
    private String outputDevice;
    private Integer inputVolume;
    private Integer outputVolume;
}

