package com.vision.vision_app_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExerciseRequest {
    
    @NotBlank(message = "Exercise name is required")
    private String name;
    
    @NotBlank(message = "Exercise type is required")
    private String type;
    
    @NotNull(message = "Duration is required")
    private Integer duration;
    
    @NotBlank(message = "Description is required")
    private String description;
}
