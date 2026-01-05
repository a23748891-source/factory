package com.factory.service;

import com.factory.dto.SystemInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.lang.management.RuntimeMXBean;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class SystemInfoService {
    
    public SystemInfoResponse getSystemInfo() {
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        RuntimeMXBean runtimeBean = ManagementFactory.getRuntimeMXBean();
        
        // CPU 사용률 - 전체 시스템 CPU 사용률 (작업 관리자와 동일)
        double cpuUsage = 0.0;
        try {
            if (osBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsBean = 
                    (com.sun.management.OperatingSystemMXBean) osBean;
                
                // 전체 시스템 CPU 사용률 사용 (작업 관리자와 동일)
                cpuUsage = sunOsBean.getSystemCpuLoad() * 100;
                
                // getSystemCpuLoad()가 -1을 반환하거나 NaN인 경우, 
                // 짧은 대기 후 다시 시도 (CPU 사용률 측정을 위해)
                if (cpuUsage < 0 || Double.isNaN(cpuUsage)) {
                    Thread.sleep(100); // 100ms 대기
                    cpuUsage = sunOsBean.getSystemCpuLoad() * 100;
                    
                    // 여전히 유효하지 않은 경우 프로세스 CPU 사용률 시도
                    if (cpuUsage < 0 || Double.isNaN(cpuUsage)) {
                        cpuUsage = sunOsBean.getProcessCpuLoad() * 100;
                        if (cpuUsage < 0 || Double.isNaN(cpuUsage)) {
                            // 마지막 대안: 시스템 부하 평균 사용
                            double loadAverage = osBean.getSystemLoadAverage();
                            if (loadAverage >= 0) {
                                // 로드 평균을 CPU 코어 수로 나누어 백분율로 변환
                                int processors = Runtime.getRuntime().availableProcessors();
                                cpuUsage = Math.min((loadAverage / processors) * 100, 100);
                            } else {
                                cpuUsage = 0.0;
                            }
                        }
                    }
                }
                
                // 음수나 NaN 값 처리
                if (cpuUsage < 0 || Double.isNaN(cpuUsage) || Double.isInfinite(cpuUsage)) {
                    cpuUsage = 0.0;
                }
                
                // 100% 초과 값 제한
                if (cpuUsage > 100) {
                    cpuUsage = 100.0;
                }
            } else {
                // com.sun.management.OperatingSystemMXBean를 사용할 수 없는 경우
                // 시스템 로드 평균 사용
                double loadAverage = osBean.getSystemLoadAverage();
                if (loadAverage >= 0) {
                    int processors = Runtime.getRuntime().availableProcessors();
                    cpuUsage = Math.min((loadAverage / processors) * 100, 100);
                } else {
                    cpuUsage = 0.0;
                }
            }
        } catch (Exception e) {
            // 오류 발생 시 시스템 로드 평균 사용
            try {
                double loadAverage = osBean.getSystemLoadAverage();
                if (loadAverage >= 0) {
                    int processors = Runtime.getRuntime().availableProcessors();
                    cpuUsage = Math.min((loadAverage / processors) * 100, 100);
                } else {
                    cpuUsage = 0.0;
                }
            } catch (Exception ex) {
                cpuUsage = 0.0;
            }
        }
        
        // 메모리 정보 - 전체 시스템 메모리 (작업 관리자와 동일)
        long totalMemory = 0;
        long usedMemory = 0;
        long freeMemory = 0;
        double memoryUsage = 0.0;
        
        try {
            if (osBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsBean = 
                    (com.sun.management.OperatingSystemMXBean) osBean;
                
                // 전체 시스템 물리 메모리
                totalMemory = sunOsBean.getTotalPhysicalMemorySize();
                // 사용 가능한 물리 메모리
                freeMemory = sunOsBean.getFreePhysicalMemorySize();
                // 사용 중인 메모리
                usedMemory = totalMemory - freeMemory;
                // 메모리 사용률
                memoryUsage = (double) usedMemory / totalMemory * 100;
            } else {
                // com.sun.management를 사용할 수 없는 경우 JVM 메모리 사용
                long jvmTotal = Runtime.getRuntime().totalMemory();
                long jvmFree = Runtime.getRuntime().freeMemory();
                long jvmUsed = jvmTotal - jvmFree;
                long jvmMax = Runtime.getRuntime().maxMemory();
                totalMemory = jvmMax;
                usedMemory = jvmUsed;
                freeMemory = jvmMax - jvmUsed;
                memoryUsage = (double) jvmUsed / jvmMax * 100;
            }
        } catch (Exception e) {
            // 오류 발생 시 JVM 메모리 사용
            long jvmTotal = Runtime.getRuntime().totalMemory();
            long jvmFree = Runtime.getRuntime().freeMemory();
            long jvmUsed = jvmTotal - jvmFree;
            long jvmMax = Runtime.getRuntime().maxMemory();
            totalMemory = jvmMax;
            usedMemory = jvmUsed;
            freeMemory = jvmMax - jvmUsed;
            memoryUsage = (double) jvmUsed / jvmMax * 100;
        }
        
        // 디스크 정보
        File root = new File("/");
        if (System.getProperty("os.name").toLowerCase().contains("windows")) {
            root = new File("C:");
        }
        long totalDiskSpace = root.getTotalSpace();
        long freeDiskSpace = root.getFreeSpace();
        long usedDiskSpace = totalDiskSpace - freeDiskSpace;
        double diskUsage = (double) usedDiskSpace / totalDiskSpace * 100;
        
        // OS 정보
        String osName = System.getProperty("os.name");
        String osVersion = System.getProperty("os.version");
        String osArch = System.getProperty("os.arch");
        String javaVersion = System.getProperty("java.version");
        
        // 프로세서 수
        int processorCount = Runtime.getRuntime().availableProcessors();
        
        // 가동 시간
        long uptimeMillis = runtimeBean.getUptime();
        Duration uptime = Duration.ofMillis(uptimeMillis);
        long days = uptime.toDays();
        long hours = uptime.toHours() % 24;
        long minutes = uptime.toMinutes() % 60;
        String uptimeString = String.format("%d일 %d시간 %d분", days, hours, minutes);
        
        return SystemInfoResponse.builder()
                .cpuUsage(Math.round(cpuUsage * 10.0) / 10.0)
                .memoryUsage(Math.round(memoryUsage * 10.0) / 10.0)
                .totalMemory(totalMemory)
                .usedMemory(usedMemory)
                .freeMemory(freeMemory)
                .diskUsage(Math.round(diskUsage * 10.0) / 10.0)
                .totalDiskSpace(totalDiskSpace)
                .freeDiskSpace(freeDiskSpace)
                .osName(osName)
                .osVersion(osVersion)
                .osArch(osArch)
                .javaVersion(javaVersion)
                .uptime(uptimeString)
                .processorCount(processorCount)
                .build();
    }
}

