package com.vision.vision_app_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "exercise_result")
public class ExerciseResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id")
    private Long sessionId;

    private Double accuracy;

    @Column(name = "focus_duration")
    private Integer focusDuration;

    @Column(name = "movement_score")
    private Double movementScore;

    @Column(name = "improvement_score")
    private Double improvementScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
