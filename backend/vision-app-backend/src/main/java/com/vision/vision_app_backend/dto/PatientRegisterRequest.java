package com.vision.vision_app_backend.dto;

import lombok.Data;

@Data
public class PatientRegisterRequest {

    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String password;

    private Long doctorId; // 🔥 IMPORTANT
}