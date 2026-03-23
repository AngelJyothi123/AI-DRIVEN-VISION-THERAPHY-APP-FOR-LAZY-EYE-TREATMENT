package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.dto.DoctorRegisterRequest;
import com.vision.vision_app_backend.dto.DoctorResponse;
import com.vision.vision_app_backend.entity.Doctor;
import com.vision.vision_app_backend.repository.DoctorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository,
                         PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public DoctorResponse registerDoctor(DoctorRegisterRequest request) {

        // Check email
        doctorRepository.findByEmail(request.getEmail())
                .ifPresent(d -> {
                    throw new IllegalArgumentException("Email already registered");
                });

        // Create entity
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());

        // 🔥 HASH PASSWORD
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));

        doctor.setQualification(request.getQualification());
        doctor.setHospital(request.getHospital());
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setUpdatedAt(LocalDateTime.now());

        Doctor savedDoctor = doctorRepository.save(doctor);

        // Convert to response
        DoctorResponse response = new DoctorResponse();
        response.setId(savedDoctor.getId());
        response.setName(savedDoctor.getName());
        response.setEmail(savedDoctor.getEmail());
        response.setPhone(savedDoctor.getPhone());
        response.setQualification(savedDoctor.getQualification());
        response.setHospital(savedDoctor.getHospital());
        response.setCreatedAt(savedDoctor.getCreatedAt());

        return response;
    }
}