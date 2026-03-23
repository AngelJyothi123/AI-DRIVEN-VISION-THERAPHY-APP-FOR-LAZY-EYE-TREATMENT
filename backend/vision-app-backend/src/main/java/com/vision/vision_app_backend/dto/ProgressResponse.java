package com.vision.vision_app_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProgressResponse {
    
    private Long patientId;
    private String patientName;
    private List<ExerciseSessionData> sessions;
    private Double averageAccuracy;
    private Double averageImprovementScore;
    private Integer totalSessions;
    
    @Data
    public static class ExerciseSessionData {
        private Long sessionId;
        private String exerciseName;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Double accuracy;
        private Integer focusDuration;
        private Double movementScore;
        private Double improvementScore;
    }
}
