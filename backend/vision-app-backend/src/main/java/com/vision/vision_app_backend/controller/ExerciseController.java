package com.vision.vision_app_backend.controller;

import com.vision.vision_app_backend.entity.Exercise;
import com.vision.vision_app_backend.service.ExerciseService;
import com.vision.vision_app_backend.repository.ExerciseRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final ExerciseRepository exerciseRepository;

    public ExerciseController(ExerciseService exerciseService, ExerciseRepository exerciseRepository) {
        this.exerciseService = exerciseService;
        this.exerciseRepository = exerciseRepository;
    }

    @GetMapping
    public List<Exercise> getAllExercises() {
        return exerciseService.getAllExercises();
    }

    @GetMapping("/{id}")
    public Exercise getExerciseById(@PathVariable("id") Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    @PostMapping
    public Exercise createExercise(@RequestBody Exercise exercise) {
        exercise.setCreatedAt(LocalDateTime.now());
        exercise.setUpdatedAt(LocalDateTime.now());
        return exerciseRepository.save(exercise);
    }

    @PutMapping("/{id}")
    public Exercise updateExercise(@PathVariable("id") Long id, @RequestBody Exercise exerciseDetails) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));

        exercise.setName(exerciseDetails.getName());
        exercise.setType(exerciseDetails.getType());
        exercise.setDuration(exerciseDetails.getDuration());
        exercise.setDescription(exerciseDetails.getDescription());
        exercise.setUpdatedAt(LocalDateTime.now());

        return exerciseRepository.save(exercise);
    }

    @DeleteMapping("/{id}")
    public void deleteExercise(@PathVariable("id") Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
        exerciseRepository.delete(exercise);
    }
}
