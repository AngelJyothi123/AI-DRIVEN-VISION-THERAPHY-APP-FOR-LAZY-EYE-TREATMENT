package com.vision.vision_app_backend.dto;


import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;
}