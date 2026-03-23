package com.vision.vision_app_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private Long doctorId;
    private LocalDateTime createdAt;
}