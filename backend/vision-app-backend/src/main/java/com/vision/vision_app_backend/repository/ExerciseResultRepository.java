package com.vision.vision_app_backend.repository;

import com.vision.vision_app_backend.entity.ExerciseResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseResultRepository extends JpaRepository<ExerciseResult, Long> {
    
    List<ExerciseResult> findBySessionId(Long sessionId);
}
