package com.factory.repository;

import com.factory.entity.MicrophoneSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MicrophoneSettingsRepository extends JpaRepository<MicrophoneSettings, Long> {
    Optional<MicrophoneSettings> findByUserId(String userId);
    void deleteByUserId(String userId);
}

