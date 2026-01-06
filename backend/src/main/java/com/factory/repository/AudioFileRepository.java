package com.factory.repository;

import com.factory.entity.AudioFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AudioFileRepository extends JpaRepository<AudioFile, Long> {
    List<AudioFile> findByUserIdOrderByCreatedAtDesc(String userId);
    
    Optional<AudioFile> findByUserIdAndFileName(String userId, String fileName);
    
    @Query("SELECT a FROM AudioFile a WHERE a.createdAt < :beforeDate")
    List<AudioFile> findFilesOlderThan(LocalDateTime beforeDate);
    
    void deleteByCreatedAtBefore(LocalDateTime beforeDate);
}

