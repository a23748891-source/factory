package com.factory.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String user_id;
    private String password;
}
