package com.vision.vision_app_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExerciseHistoryResponse {
    
    private Long patientId;
    private List<ExerciseHistoryItem> history;
    
    @Data
    public static class ExerciseHistoryItem {
        private Long sessionId;
        private Long exerciseId;
        private String exerciseName;
        private String exerciseType;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Double accuracy;
        private Integer focusDuration;
        private Double movementScore;
        private Double improvementScore;
    }
}
