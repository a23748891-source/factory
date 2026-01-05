package com.factory.service;

import com.factory.dto.EventResponse;
import com.factory.entity.Event;
import com.factory.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    
    private final EventRepository eventRepository;
    
    /**
     * 모든 이벤트 조회 (전체 공유)
     * 시스템에 저장된 모든 이벤트를 시간순으로 반환합니다.
     * 모든 사용자가 동일한 이벤트 목록을 확인할 수 있습니다.
     */
    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAllByOrderByCreatedAtDesc();
        return events.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    public List<EventResponse> getEventsWithFilters(String zone, String type, String severity, String dateRange) {
        LocalDateTime startDate = null;
        
        if (dateRange != null && !dateRange.equals("all")) {
            LocalDateTime now = LocalDateTime.now();
            switch (dateRange) {
                case "today":
                    startDate = now.toLocalDate().atStartOfDay();
                    break;
                case "week":
                    startDate = now.minusDays(7);
                    break;
                case "month":
                    startDate = now.minusDays(30);
                    break;
            }
        }
        
        List<Event> events = eventRepository.findEventsWithFilters(
            "all".equals(zone) ? null : zone,
            "all".equals(type) ? null : type,
            "all".equals(severity) ? null : severity,
            startDate
        );
        
        return events.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    /**
     * 이벤트 생성 (전체 공유)
     * 위험 감지 시 시스템 전체에 공유되는 이벤트를 생성합니다.
     * 모든 사용자가 이 이벤트를 확인할 수 있습니다.
     */
    @Transactional
    public EventResponse createEvent(String zone, String area, String type, String message, String severity) {
        Event event = Event.builder()
            .zone(zone)
            .area(area)
            .type(type)
            .message(message)
            .severity(severity)
            .build();
        
        event = eventRepository.save(event);
        log.info("이벤트 생성 (전체 공유): {} - {}", zone, message);
        
        return mapToResponse(event);
    }
    
    private EventResponse mapToResponse(Event event) {
        String typeLabel = getTypeLabel(event.getType());
        
        return EventResponse.builder()
            .id(event.getId())
            .zone(event.getZone())
            .area(event.getArea())
            .type(event.getType())
            .typeLabel(typeLabel)
            .message(event.getMessage())
            .severity(event.getSeverity())
            .audioFilePath(event.getAudioFilePath())
            .timestamp(event.getCreatedAt())
            .build();
    }
    
    private String getTypeLabel(String type) {
        switch (type) {
            case "scream":
                return "비명 감지";
            case "help":
                return "도움 요청";
            case "emergency":
                return "비상상황";
            case "normal":
                return "안전";
            default:
                return type;
        }
    }
}

