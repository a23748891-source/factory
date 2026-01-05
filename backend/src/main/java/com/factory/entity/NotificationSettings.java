package com.factory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false, unique = true, length = 50)
    private String userId;
    
    @Column(name = "emergency_enabled", nullable = false)
    @Builder.Default
    private Boolean emergencyEnabled = true;
    
    @Column(name = "emergency_sound_enabled", nullable = false)
    @Builder.Default
    private Boolean emergencySoundEnabled = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (emergencyEnabled == null) {
            emergencyEnabled = true;
        }
        if (emergencySoundEnabled == null) {
            emergencySoundEnabled = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

