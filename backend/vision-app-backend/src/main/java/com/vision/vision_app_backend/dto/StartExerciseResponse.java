package com.vision.vision_app_backend.dto;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StartExerciseResponse {
    private Long sessionId;
    private String message;
}