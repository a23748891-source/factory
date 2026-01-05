package com.factory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "zone", nullable = false)
    private String zone;
    
    @Column(name = "area")
    private String area;
    
    @Column(name = "type", nullable = false)
    private String type; // emergency, noise, voice
    
    @Column(name = "message", nullable = false, length = 500)
    private String message;
    
    @Column(name = "severity", nullable = false)
    private String severity; // high, medium, low
    
    @Column(name = "audio_file_path")
    private String audioFilePath;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

