package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.dto.ExerciseResultRequest;
import com.vision.vision_app_backend.dto.ExerciseResultResponse;
import com.vision.vision_app_backend.entity.ExerciseResult;
import com.vision.vision_app_backend.repository.ExerciseResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Service
public class ExerciseResultService {

    @Autowired
    private ExerciseResultRepository exerciseResultRepository;

    @Autowired
    private RestTemplate restTemplate;

    public ExerciseResultResponse saveExerciseResult(ExerciseResultRequest request) {
        ExerciseResult result = new ExerciseResult();
        result.setSessionId(request.getSessionId());
        result.setAccuracy(request.getAccuracy());
        result.setFocusDuration(request.getFocusDuration());
        result.setMovementScore(request.getMovementScore());
        
        // Call ML service to get improvement score
        Double improvementScore = callMLService(request);
        result.setImprovementScore(improvementScore);
        
        result.setCreatedAt(LocalDateTime.now());
        result.setUpdatedAt(LocalDateTime.now());
        
        ExerciseResult savedResult = exerciseResultRepository.save(result);
        
        ExerciseResultResponse response = mapToResponse(savedResult);
        
        // ML Response enrichment (Ephemeral recommendations for UI overlay)
        try {
            String mlServiceUrl = "http://localhost:5000/predict";
            MLRequest mlRequest = new MLRequest();
            mlRequest.setAccuracy(request.getAccuracy());
            mlRequest.setFocusDuration(request.getFocusDuration());
            mlRequest.setMovementScore(request.getMovementScore());
            MLResponse mlResponse = restTemplate.postForObject(mlServiceUrl, mlRequest, MLResponse.class);
            if (mlResponse != null && mlResponse.getRecommendedExercise() != null) {
                response.setRecommendedExercise(mlResponse.getRecommendedExercise());
            }
        } catch(Exception ignored) {}

        return response;
    }

    private Double callMLService(ExerciseResultRequest request) {
        try {
            String mlServiceUrl = "http://localhost:5000/predict";
            
            MLRequest mlRequest = new MLRequest();
            mlRequest.setAccuracy(request.getAccuracy());
            mlRequest.setFocusDuration(request.getFocusDuration());
            mlRequest.setMovementScore(request.getMovementScore());
            
            MLResponse mlResponse = restTemplate.postForObject(mlServiceUrl, mlRequest, MLResponse.class);
            
            return mlResponse != null ? mlResponse.getImprovementScore() : 0.0;
        } catch (Exception e) {
            // Fallback to simple calculation if ML service is unavailable
            return calculateSimpleImprovementScore(request);
        }
    }

    private Double calculateSimpleImprovementScore(ExerciseResultRequest request) {
        // Simple algorithm: (accuracy * 0.4) + (focus_duration/100 * 0.3) + (movement_score * 0.3)
        return (request.getAccuracy() * 0.4) + 
               ((double) request.getFocusDuration() / 100 * 0.3) + 
               (request.getMovementScore() * 0.3);
    }

    private ExerciseResultResponse mapToResponse(ExerciseResult result) {
        ExerciseResultResponse response = new ExerciseResultResponse();
        response.setId(result.getId());
        response.setSessionId(result.getSessionId());
        response.setAccuracy(result.getAccuracy());
        response.setFocusDuration(result.getFocusDuration());
        response.setMovementScore(result.getMovementScore());
        response.setImprovementScore(result.getImprovementScore());
        response.setCreatedAt(result.getCreatedAt());
        response.setUpdatedAt(result.getUpdatedAt());
        return response;
    }

    // DTOs for ML service communication
    private static class MLRequest {
        @JsonProperty("accuracy")
        private Double accuracy;
        @JsonProperty("focus_duration")
        private Integer focusDuration;
        @JsonProperty("movement_score")
        private Double movementScore;

        // Getters and setters
        public Double getAccuracy() { return accuracy; }
        public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
        public Integer getFocusDuration() { return focusDuration; }
        public void setFocusDuration(Integer focusDuration) { this.focusDuration = focusDuration; }
        public Double getMovementScore() { return movementScore; }
        public void setMovementScore(Double movementScore) { this.movementScore = movementScore; }
    }

    private static class MLResponse {
        @JsonProperty("improvementScore")
        private Double improvementScore;
        
        @JsonProperty("recommendedExercise")
        private String recommendedExercise;

        public Double getImprovementScore() { return improvementScore; }
        public void setImprovementScore(Double improvementScore) { this.improvementScore = improvementScore; }
        
        public String getRecommendedExercise() { return recommendedExercise; }
        public void setRecommendedExercise(String recommendedExercise) { this.recommendedExercise = recommendedExercise; }
    }
}
