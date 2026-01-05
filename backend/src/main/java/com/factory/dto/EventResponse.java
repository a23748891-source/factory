package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String zone;
    private String area;
    private String type;
    private String typeLabel;
    private String message;
    private String severity;
    private String audioFilePath;
    private LocalDateTime timestamp;
}

