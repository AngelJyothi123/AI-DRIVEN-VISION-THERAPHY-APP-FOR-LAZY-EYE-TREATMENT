package com.vision.vision_app_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EndExerciseRequest {
    
    @NotNull(message = "Session ID is required")
    private Long sessionId;
    
    @NotNull(message = "Accuracy is required")
    private Double accuracy;
    
    @NotNull(message = "Focus duration is required")
    private Integer focusDuration;
    
    @NotNull(message = "Movement score is required")
    private Double movementScore;
}
