package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.dto.RecommendationRequest;
import com.vision.vision_app_backend.dto.RecommendationResponse;
import com.vision.vision_app_backend.entity.Recommendation;
import com.vision.vision_app_backend.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    public RecommendationResponse createRecommendation(RecommendationRequest request, Long doctorId) {
        Recommendation recommendation = new Recommendation();
        recommendation.setDoctorId(doctorId);
        recommendation.setPatientId(request.getPatientId());
        recommendation.setExerciseId(request.getExerciseId());
        recommendation.setDuration(request.getDuration());
        recommendation.setCreatedAt(LocalDateTime.now());
        recommendation.setUpdatedAt(LocalDateTime.now());

        Recommendation savedRecommendation = recommendationRepository.save(recommendation);
        return mapToResponse(savedRecommendation);
    }

    public List<RecommendationResponse> getRecommendationsByDoctor(Long doctorId) {
        return recommendationRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RecommendationResponse> getRecommendationsByPatient(Long patientId) {
        return recommendationRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RecommendationResponse> getRecommendationsForDoctorPatient(Long doctorId, Long patientId) {
        return recommendationRepository.findByDoctorIdAndPatientId(doctorId, patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RecommendationResponse mapToResponse(Recommendation recommendation) {
        RecommendationResponse response = new RecommendationResponse();
        response.setId(recommendation.getId());
        response.setDoctorId(recommendation.getDoctorId());
        response.setPatientId(recommendation.getPatientId());
        response.setExerciseId(recommendation.getExerciseId());
        response.setDuration(recommendation.getDuration());
        response.setCreatedAt(recommendation.getCreatedAt());
        response.setUpdatedAt(recommendation.getUpdatedAt());
        return response;
    }
}
