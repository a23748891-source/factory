package com.factory.repository;

import com.factory.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByEmail(String email);
    void deleteByUserId(String userId);
}
