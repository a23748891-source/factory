package com.factory.controller;

import com.factory.dto.ErrorResponse;
import com.factory.dto.EventResponse;
import com.factory.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {
    
    private final EventService eventService;
    
    /**
     * 모든 이벤트 조회
     * 모든 사용자가 동일한 전체 이벤트 로그를 확인할 수 있습니다.
     * 이벤트는 사용자별이 아니라 시스템 전체에 공유됩니다.
     */
    @GetMapping
    public ResponseEntity<?> getAllEvents(
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String dateRange) {
        try {
            List<EventResponse> events;
            
            if (zone != null || type != null || severity != null || dateRange != null) {
                events = eventService.getEventsWithFilters(
                    zone != null ? zone : "all",
                    type != null ? type : "all",
                    severity != null ? severity : "all",
                    dateRange != null ? dateRange : "all"
                );
            } else {
                events = eventService.getAllEvents();
            }
            
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("이벤트 조회 실패: " + e.getMessage()));
        }
    }
    
    /**
     * 이벤트 통계 조회
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getEventStats() {
        try {
            List<EventResponse> allEvents = eventService.getAllEvents();
            
            long total = allEvents.size();
            long today = allEvents.stream()
                .filter(e -> e.getTimestamp().toLocalDate().equals(java.time.LocalDate.now()))
                .count();
            
            long thisWeek = allEvents.stream()
                .filter(e -> e.getTimestamp().isAfter(java.time.LocalDateTime.now().minusDays(7)))
                .count();
            
            long thisMonth = allEvents.stream()
                .filter(e -> e.getTimestamp().isAfter(java.time.LocalDateTime.now().minusDays(30)))
                .count();
            
            Map<String, Long> stats = Map.of(
                "total", total,
                "today", today,
                "thisWeek", thisWeek,
                "thisMonth", thisMonth
            );
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("통계 조회 실패: " + e.getMessage()));
        }
    }
}

