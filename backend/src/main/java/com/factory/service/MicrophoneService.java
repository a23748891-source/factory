package com.factory.service;

import com.factory.dto.*;
import com.factory.entity.MicrophoneSettings;
import com.factory.repository.MicrophoneSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sound.sampled.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MicrophoneService {
    
    private final MicrophoneSettingsRepository settingsRepository;
    private final Random random = new Random();
    
    /**
     * 사용자의 마이크 설정을 저장하거나 업데이트
     */
    @Transactional
    public MicrophoneSettingsResponse saveSettings(String userId, MicrophoneSettingsRequest request) {
        Optional<MicrophoneSettings> existing = settingsRepository.findByUserId(userId);
        
        MicrophoneSettings settings;
        if (existing.isPresent()) {
            settings = existing.get();
            updateSettings(settings, request);
        } else {
            settings = createSettings(userId, request);
        }
        
        settings = settingsRepository.save(settings);
        return mapToResponse(settings);
    }
    
    /**
     * 사용자의 마이크 설정을 조회
     */
    public MicrophoneSettingsResponse getSettings(String userId) {
        Optional<MicrophoneSettings> settings = settingsRepository.findByUserId(userId);
        
        if (settings.isPresent()) {
            return mapToResponse(settings.get());
        } else {
            // 기본 설정 반환
            return MicrophoneSettingsResponse.builder()
                    .userId(userId)
                    .inputVolume(75)
                    .outputVolume(80)
                    .inputDevice("default")
                    .outputDevice("default")
                    .build();
        }
    }
    
    /**
     * 마이크 상태 조회 (실시간)
     */
    public MicrophoneStatusResponse getStatus(String userId) {
        Optional<MicrophoneSettings> settingsOpt = settingsRepository.findByUserId(userId);
        
        // 실제 마이크 입력 레벨을 읽으려면 복잡한 처리가 필요하므로
        // 여기서는 시뮬레이션 데이터를 반환
        // 실제 구현 시에는 javax.sound.sampled 패키지를 사용하여 실제 레벨을 읽어야 함
        
        String status = "active";
        int inputLevel = 30 + random.nextInt(30);
        int outputLevel = 25 + random.nextInt(20);
        
        String device = settingsOpt.map(MicrophoneSettings::getInputDevice)
                .orElse("Default Microphone");
        
        return MicrophoneStatusResponse.builder()
                .status(status)
                .inputLevel(inputLevel)
                .outputLevel(outputLevel)
                .device(device)
                .isEnabled(true)
                .build();
    }
    
    /**
     * 사용 가능한 오디오 장치 목록 조회
     */
    public AudioDeviceResponse getAvailableDevices() {
        List<AudioDeviceResponse.AudioDevice> inputDevices = new ArrayList<>();
        List<AudioDeviceResponse.AudioDevice> outputDevices = new ArrayList<>();
        
        try {
            // 입력 장치 (마이크)
            Mixer.Info[] mixerInfos = AudioSystem.getMixerInfo();
            for (Mixer.Info info : mixerInfos) {
                Mixer mixer = AudioSystem.getMixer(info);
                
                // 입력 라인 확인
                Line.Info[] inputLines = mixer.getTargetLineInfo();
                if (inputLines.length > 0) {
                    inputDevices.add(AudioDeviceResponse.AudioDevice.builder()
                            .id(info.getName())
                            .name(info.getName())
                            .description(info.getDescription())
                            .build());
                }
                
                // 출력 라인 확인
                Line.Info[] outputLines = mixer.getSourceLineInfo();
                if (outputLines.length > 0) {
                    outputDevices.add(AudioDeviceResponse.AudioDevice.builder()
                            .id(info.getName())
                            .name(info.getName())
                            .description(info.getDescription())
                            .build());
                }
            }
        } catch (Exception e) {
            // 오디오 장치를 읽을 수 없는 경우 기본 장치 반환
            inputDevices.add(AudioDeviceResponse.AudioDevice.builder()
                    .id("default")
                    .name("Default Microphone")
                    .description("Default input device")
                    .build());
            
            outputDevices.add(AudioDeviceResponse.AudioDevice.builder()
                    .id("default")
                    .name("Default Speaker")
                    .description("Default output device")
                    .build());
        }
        
        // 장치가 없는 경우 기본 장치 추가
        if (inputDevices.isEmpty()) {
            inputDevices.add(AudioDeviceResponse.AudioDevice.builder()
                    .id("default")
                    .name("Default Microphone")
                    .description("Default input device")
                    .build());
        }
        
        if (outputDevices.isEmpty()) {
            outputDevices.add(AudioDeviceResponse.AudioDevice.builder()
                    .id("default")
                    .name("Default Speaker")
                    .description("Default output device")
                    .build());
        }
        
        return AudioDeviceResponse.builder()
                .inputDevices(inputDevices)
                .outputDevices(outputDevices)
                .build();
    }
    
    private MicrophoneSettings createSettings(String userId, MicrophoneSettingsRequest request) {
        return MicrophoneSettings.builder()
                .userId(userId)
                .inputDevice(request.getInputDevice() != null ? request.getInputDevice() : "default")
                .outputDevice(request.getOutputDevice() != null ? request.getOutputDevice() : "default")
                .inputVolume(request.getInputVolume() != null ? request.getInputVolume() : 75)
                .outputVolume(request.getOutputVolume() != null ? request.getOutputVolume() : 80)
                .build();
    }
    
    private void updateSettings(MicrophoneSettings settings, MicrophoneSettingsRequest request) {
        if (request.getInputDevice() != null) {
            settings.setInputDevice(request.getInputDevice());
        }
        if (request.getOutputDevice() != null) {
            settings.setOutputDevice(request.getOutputDevice());
        }
        if (request.getInputVolume() != null) {
            settings.setInputVolume(request.getInputVolume());
        }
        if (request.getOutputVolume() != null) {
            settings.setOutputVolume(request.getOutputVolume());
        }
    }
    
    private MicrophoneSettingsResponse mapToResponse(MicrophoneSettings settings) {
        return MicrophoneSettingsResponse.builder()
                .id(settings.getId())
                .userId(settings.getUserId())
                .inputDevice(settings.getInputDevice())
                .outputDevice(settings.getOutputDevice())
                .inputVolume(settings.getInputVolume())
                .outputVolume(settings.getOutputVolume())
                .createdAt(settings.getCreatedAt())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}

