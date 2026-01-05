package com.factory.service;

import com.factory.config.JwtProvider;
import com.factory.dto.*;
import com.factory.entity.User;
import com.factory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    
    @Transactional
    public UserResponse register(SignupRequest request) {
        // 중복 체크
        if (userRepository.existsByUserId(request.getUser_id())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다");
        }
        
        // 사용자 생성
        User user = User.builder()
                .userId(request.getUser_id())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .role(request.getRole() != null ? request.getRole() : "user")
                .build();
        
        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }
    
    public LoginResponse login(LoginRequest request) {
        // 사용자 조회
        User user = userRepository.findByUserId(request.getUser_id())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다"));
        
        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다");
        }
        
        // JWT 토큰 생성
        String token = jwtProvider.generateToken(user.getUserId());
        
        return LoginResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }
    
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return UserResponse.from(user);
    }
    
    @Transactional
    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        // 이름 업데이트
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName());
        }
        
        // 이메일 업데이트 (중복 체크)
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!user.getEmail().equals(request.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("이미 사용 중인 이메일입니다");
            }
            user.setEmail(request.getEmail());
        }
        
        // 비밀번호 변경 (현재 비밀번호 확인 필요)
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
                throw new RuntimeException("현재 비밀번호를 입력해주세요");
            }
            
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("현재 비밀번호가 올바르지 않습니다");
            }
            
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return UserResponse.from(updatedUser);
    }
}
