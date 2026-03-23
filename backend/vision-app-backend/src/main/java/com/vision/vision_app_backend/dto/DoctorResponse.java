package com.vision.vision_app_backend.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DoctorResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String qualification;
    private String hospital;
    private LocalDateTime createdAt;
}