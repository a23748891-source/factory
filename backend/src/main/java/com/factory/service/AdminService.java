package com.factory.service;

import com.factory.dto.UserResponse;
import com.factory.entity.User;
import com.factory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    
    private final UserRepository userRepository;
    
    /**
     * 모든 사용자 조회
     */
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }
    
    /**
     * 사용자 삭제
     */
    @Transactional
    public void deleteUser(String userId) {
        if (!userRepository.existsByUserId(userId)) {
            throw new RuntimeException("사용자를 찾을 수 없습니다");
        }
        userRepository.deleteByUserId(userId);
        log.info("사용자 삭제: {}", userId);
    }
    
    /**
     * 사용자 역할 변경
     */
    @Transactional
    public UserResponse updateUserRole(String userId, String role) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        user.setRole(role);
        user = userRepository.save(user);
        
        return UserResponse.from(user);
    }
}

