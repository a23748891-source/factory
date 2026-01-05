package com.factory.dto;

import com.factory.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String user_id;
    private String name;
    private String email;
    private String role;
    
    public static UserResponse from(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .user_id(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

