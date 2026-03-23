package com.vision.vision_app_backend.service;



import com.vision.vision_app_backend.dto.StartExerciseRequest;
import com.vision.vision_app_backend.dto.StartExerciseResponse;
import com.vision.vision_app_backend.entity.ExerciseSession;
import com.vision.vision_app_backend.repository.ExerciseSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ExerciseSessionService {

    private final ExerciseSessionRepository repository;

    public ExerciseSessionService(ExerciseSessionRepository repository) {
        this.repository = repository;
    }

    public StartExerciseResponse startExercise(Long patientId, StartExerciseRequest request) {

        ExerciseSession session = new ExerciseSession();
        session.setPatientId(patientId);
        session.setExerciseId(request.getExerciseId());
        session.setStartTime(LocalDateTime.now());

        ExerciseSession saved = repository.save(session);

        return new StartExerciseResponse(
                saved.getId(),
                "Exercise started successfully"
        );
    }
}