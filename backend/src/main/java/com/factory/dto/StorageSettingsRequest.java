package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageSettingsRequest {
    private Boolean autoSaveEnabled;
    private Integer retentionDays;
}

