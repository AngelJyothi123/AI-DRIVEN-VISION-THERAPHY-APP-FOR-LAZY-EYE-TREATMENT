package com.vision.vision_app_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecommendationRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Exercise ID is required")
    private Long exerciseId;
    
    @NotNull(message = "Duration is required")
    private Integer duration;
}
