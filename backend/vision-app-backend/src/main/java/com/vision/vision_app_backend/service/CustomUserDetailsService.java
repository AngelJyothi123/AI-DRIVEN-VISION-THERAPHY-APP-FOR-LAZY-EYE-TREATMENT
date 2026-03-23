package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.entity.Doctor;
import com.vision.vision_app_backend.entity.Patient;
import com.vision.vision_app_backend.repository.DoctorRepository;
import com.vision.vision_app_backend.repository.PatientRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;

    public CustomUserDetailsService(DoctorRepository doctorRepo,
                                    PatientRepository patientRepo) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 🔥 CHECK DOCTOR FIRST
        Doctor doctor = doctorRepo.findByEmail(email).orElse(null);

        if (doctor != null) {
            return new User(
                    doctor.getEmail(),
                    doctor.getPassword(),
                    Collections.singleton(() -> "ROLE_DOCTOR")
            );
        }

        // 🔥 CHECK PATIENT
        Patient patient = patientRepo.findByEmail(email).orElse(null);

        if (patient != null) {
            return new User(
                    patient.getEmail(),
                    patient.getPassword(),
                    Collections.singleton(() -> "ROLE_PATIENT")
            );
        }

        throw new UsernameNotFoundException("User not found");
    }
}