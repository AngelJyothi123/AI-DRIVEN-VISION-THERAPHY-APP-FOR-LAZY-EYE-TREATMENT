package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.dto.LoginRequest;
import com.vision.vision_app_backend.dto.LoginResponse;
import com.vision.vision_app_backend.entity.Doctor;
import com.vision.vision_app_backend.entity.Patient;
import com.vision.vision_app_backend.repository.DoctorRepository;
import com.vision.vision_app_backend.repository.PatientRepository;
import com.vision.vision_app_backend.config.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(DoctorRepository doctorRepository,
                       PatientRepository patientRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        // 🔍 Try Doctor login
        Doctor doctor = doctorRepository.findByEmail(request.getEmail()).orElse(null);

        if (doctor != null) {

            if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            String token = jwtUtil.generateToken(doctor.getEmail(), "DOCTOR");

            return new LoginResponse(token,"DOCTOR");
        }

        // 🔍 Try Patient login
        Patient patient = patientRepository.findByEmail(request.getEmail()).orElse(null);

        if (patient != null) {

            if (!passwordEncoder.matches(request.getPassword(), patient.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            String token = jwtUtil.generateToken(patient.getEmail(), "PATIENT");

            return new LoginResponse(token, "PATIENT");
        }

        // ❌ If not found
        throw new RuntimeException("User not found");
    }
}