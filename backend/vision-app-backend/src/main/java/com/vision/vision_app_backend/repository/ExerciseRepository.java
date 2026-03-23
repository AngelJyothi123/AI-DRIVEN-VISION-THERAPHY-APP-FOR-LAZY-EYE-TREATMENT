package com.vision.vision_app_backend.repository;


import com.vision.vision_app_backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
}