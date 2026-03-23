package com.vision.vision_app_backend.repository;


import com.vision.vision_app_backend.entity.ExerciseSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseSessionRepository extends JpaRepository<ExerciseSession, Long> {
    java.util.List<ExerciseSession> findByPatientId(Long patientId);
}