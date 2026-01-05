package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemInfoResponse {
    private Double cpuUsage;
    private Double memoryUsage;
    private Long totalMemory;
    private Long usedMemory;
    private Long freeMemory;
    private Double diskUsage;
    private Long totalDiskSpace;
    private Long freeDiskSpace;
    private String osName;
    private String osVersion;
    private String osArch;
    private String javaVersion;
    private String uptime;
    private Integer processorCount;
}

