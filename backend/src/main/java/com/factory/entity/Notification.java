package com.factory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "type", nullable = false)
    private String type; // emergency, noise, voice, system
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "message", nullable = false, length = 500)
    private String message;
    
    @Column(name = "priority", nullable = false)
    private String priority; // high, medium, low
    
    @Column(name = "is_read", nullable = false)
    private Boolean read;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (read == null) {
            read = false;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

