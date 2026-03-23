package com.vision.vision_app_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExerciseResponse {
    
    private Long id;
    private String name;
    private String type;
    private Integer duration;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
