package com.vision.vision_app_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RecommendationResponse {
    
    private Long id;
    private Long doctorId;
    private Long patientId;
    private Long exerciseId;
    private Integer duration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
