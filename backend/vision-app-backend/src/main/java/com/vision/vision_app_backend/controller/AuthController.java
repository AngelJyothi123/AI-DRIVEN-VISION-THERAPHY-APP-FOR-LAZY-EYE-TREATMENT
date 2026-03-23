package com.vision.vision_app_backend.controller;

import com.vision.vision_app_backend.dto.*;
import com.vision.vision_app_backend.service.AuthService;
import com.vision.vision_app_backend.service.DoctorService;
import com.vision.vision_app_backend.service.PatientService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AuthService authService;

    public AuthController(DoctorService doctorService,
                          PatientService patientService,
                          AuthService authService) {
        this.doctorService = doctorService;
        this.patientService = patientService;
        this.authService = authService;
    }

    @PostMapping("/register/doctor")
    public DoctorResponse registerDoctor(@RequestBody DoctorRegisterRequest request) {
        return doctorService.registerDoctor(request);
    }

    @PostMapping("/register/patient")
    public PatientResponse registerPatient(@RequestBody PatientRegisterRequest request) {
        return patientService.registerPatient(request);
    }

    // 🔥 LOGIN API
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}