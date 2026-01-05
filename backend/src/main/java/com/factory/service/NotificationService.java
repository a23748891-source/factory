package com.factory.service;

import com.factory.dto.NotificationResponse;
import com.factory.entity.Notification;
import com.factory.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public List<NotificationResponse> getUserNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }
    
    @Transactional
    public NotificationResponse createNotification(String userId, String type, String title, String message, String priority) {
        Notification notification = Notification.builder()
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .priority(priority)
            .read(false)
            .build();
        
        notification = notificationRepository.save(notification);
        log.info("알림 생성: {} - {}", userId, title);
        
        return mapToResponse(notification);
    }
    
    @Transactional
    public void markAsRead(Long id, String userId) {
        notificationRepository.markAsReadByIdAndUserId(id, userId);
    }
    
    @Transactional
    public void markAllAsRead(String userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
    
    @Transactional
    public void deleteNotification(Long id, String userId) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다");
        }
        
        notificationRepository.delete(notification);
    }
    
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
            .id(notification.getId())
            .type(notification.getType())
            .title(notification.getTitle())
            .message(notification.getMessage())
            .priority(notification.getPriority())
            .read(notification.getRead())
            .timestamp(notification.getCreatedAt())
            .build();
    }
}

