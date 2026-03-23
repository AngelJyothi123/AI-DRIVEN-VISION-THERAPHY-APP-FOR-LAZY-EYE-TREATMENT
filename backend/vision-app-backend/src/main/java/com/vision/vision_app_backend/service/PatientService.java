package com.vision.vision_app_backend.service;


import com.vision.vision_app_backend.dto.PatientRegisterRequest;
import com.vision.vision_app_backend.dto.PatientResponse;
import com.vision.vision_app_backend.entity.Doctor;
import com.vision.vision_app_backend.entity.Patient;
import com.vision.vision_app_backend.repository.DoctorRepository;
import com.vision.vision_app_backend.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository,
                          DoctorRepository doctorRepository,
                          PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PatientResponse registerPatient(PatientRegisterRequest request) {

        // Check email
        patientRepository.findByEmail(request.getEmail())
                .ifPresent(p -> {
                    throw new IllegalArgumentException("Email already registered");
                });

        // Check doctor exists
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        // Create entity
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setAge(request.getAge());

        // 🔥 HASH PASSWORD
        patient.setPassword(passwordEncoder.encode(request.getPassword()));

        patient.setDoctor(doctor);
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());

        Patient saved = patientRepository.save(patient);

        // Convert to response
        PatientResponse response = new PatientResponse();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());
        response.setPhone(saved.getPhone());
        response.setAge(saved.getAge());
        response.setDoctorId(saved.getDoctor().getId());
        response.setCreatedAt(saved.getCreatedAt());

        return response;
    }
}