package com.factory.repository;

import com.factory.entity.StorageSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StorageSettingsRepository extends JpaRepository<StorageSettings, Long> {
    Optional<StorageSettings> findByUserId(String userId);
}

