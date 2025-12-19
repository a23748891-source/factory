package com.factory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "microphone_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MicrophoneSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "enabled", nullable = false)
    private Boolean enabled;
    
    @Column(name = "mode", nullable = false)
    private String mode; // "always" or "scheduled"
    
    @Column(name = "schedule_start")
    private String scheduleStart; // HH:mm format
    
    @Column(name = "schedule_end")
    private String scheduleEnd; // HH:mm format
    
    @Column(name = "input_device")
    private String inputDevice;
    
    @Column(name = "output_device")
    private String outputDevice;
    
    @Column(name = "input_volume")
    private Integer inputVolume; // 0-100
    
    @Column(name = "output_volume")
    private Integer outputVolume; // 0-100
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

