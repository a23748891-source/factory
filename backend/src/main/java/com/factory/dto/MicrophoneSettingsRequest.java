package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MicrophoneSettingsRequest {
    private String inputDevice;
    private String outputDevice;
    private Integer inputVolume;
    private Integer outputVolume;
}

