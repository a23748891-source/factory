package com.factory.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String user_id;
    private String password;
    private String name;
    private String email;
    private String role;
}
