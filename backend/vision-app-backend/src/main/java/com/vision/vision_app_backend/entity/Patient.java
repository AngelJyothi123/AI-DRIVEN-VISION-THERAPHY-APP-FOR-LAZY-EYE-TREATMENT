package com.vision.vision_app_backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    private Integer age;

    private String password;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // 🔥 RELATIONSHIP
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    private Role role = Role.PATIENT;
}
