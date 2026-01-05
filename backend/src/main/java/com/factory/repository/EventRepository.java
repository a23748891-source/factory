package com.factory.repository;

import com.factory.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findAllByOrderByCreatedAtDesc();
    
    List<Event> findByZoneOrderByCreatedAtDesc(String zone);
    
    List<Event> findByTypeOrderByCreatedAtDesc(String type);
    
    List<Event> findBySeverityOrderByCreatedAtDesc(String severity);
    
    @Query("SELECT e FROM Event e WHERE e.createdAt >= :startDate ORDER BY e.createdAt DESC")
    List<Event> findEventsAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT e FROM Event e WHERE " +
           "(:zone IS NULL OR e.zone = :zone) AND " +
           "(:type IS NULL OR e.type = :type) AND " +
           "(:severity IS NULL OR e.severity = :severity) AND " +
           "(:startDate IS NULL OR e.createdAt >= :startDate) " +
           "ORDER BY e.createdAt DESC")
    List<Event> findEventsWithFilters(
        @Param("zone") String zone,
        @Param("type") String type,
        @Param("severity") String severity,
        @Param("startDate") LocalDateTime startDate
    );
}

