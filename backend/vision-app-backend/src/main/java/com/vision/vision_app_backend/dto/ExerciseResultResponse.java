package com.vision.vision_app_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExerciseResultResponse {
    
    private Long id;
    private Long sessionId;
    private Double accuracy;
    private Integer focusDuration;
    private Double movementScore;
    private Double improvementScore;
    private String recommendedExercise;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
