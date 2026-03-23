package com.vision.vision_app_backend.controller;

import com.vision.vision_app_backend.dto.*;
import java.util.Set;
import com.vision.vision_app_backend.entity.Doctor;
import com.vision.vision_app_backend.entity.Patient;
import com.vision.vision_app_backend.repository.DoctorRepository;
import com.vision.vision_app_backend.repository.PatientRepository;
import com.vision.vision_app_backend.repository.ExerciseSessionRepository;
import com.vision.vision_app_backend.repository.ExerciseResultRepository;
import com.vision.vision_app_backend.service.RecommendationService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final RecommendationService recommendationService;
    private final ExerciseSessionRepository sessionRepository;
    private final ExerciseResultRepository resultRepository;
    private final com.vision.vision_app_backend.repository.ExerciseRepository exerciseRepository;
    private final com.vision.vision_app_backend.service.AppointmentService appointmentService;

    public DoctorController(DoctorRepository doctorRepository,
                            PatientRepository patientRepository,
                            RecommendationService recommendationService,
                            ExerciseSessionRepository sessionRepository,
                            ExerciseResultRepository resultRepository,
                            com.vision.vision_app_backend.repository.ExerciseRepository exerciseRepository,
                            com.vision.vision_app_backend.service.AppointmentService appointmentService) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.recommendationService = recommendationService;
        this.sessionRepository = sessionRepository;
        this.resultRepository = resultRepository;
        this.exerciseRepository = exerciseRepository;
        this.appointmentService = appointmentService;
    }

    private Doctor getAuthenticatedDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email;
        if (auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername();
        } else {
            email = auth.getPrincipal().toString();
        }
        System.out.println("LOOKING UP DOCTOR PROFILE: " + email);
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor profile not found: " + email));
    }

    @GetMapping("/profile")
    public DoctorResponse getProfile() {
        Doctor doctor = getAuthenticatedDoctor();
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setName(doctor.getName());
        response.setEmail(doctor.getEmail());
        response.setPhone(doctor.getPhone());
        response.setQualification(doctor.getQualification());
        response.setHospital(doctor.getHospital());
        response.setCreatedAt(doctor.getCreatedAt());
        return response;
    }

    @GetMapping("/patients")
    public List<PatientResponse> getPatients() {
        Doctor doctor = getAuthenticatedDoctor();
        return patientRepository.findByDoctorId(doctor.getId())
                .stream()
                .map(patient -> {
                    PatientResponse pr = new PatientResponse();
                    pr.setId(patient.getId());
                    pr.setName(patient.getName());
                    pr.setEmail(patient.getEmail());
                    pr.setPhone(patient.getPhone());
                    pr.setAge(patient.getAge());
                    pr.setDoctorId(patient.getDoctor().getId());
                    pr.setCreatedAt(patient.getCreatedAt());
                    return pr;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/recommend")
    public RecommendationResponse recommendExercise(@RequestBody RecommendationRequest request) {
        Doctor doctor = getAuthenticatedDoctor();
        // Check patient belongs to doctor
        Patient patient = patientRepository.findById(request.getPatientId()).orElse(null);
        if (patient == null || !patient.getDoctor().getId().equals(doctor.getId())) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Patient not assigned to this doctor");
        }
        return recommendationService.createRecommendation(request, doctor.getId());
    }

    @GetMapping("/recommendations")
    public List<RecommendationResponse> getRecommendations() {
        Doctor doctor = getAuthenticatedDoctor();
        return recommendationService.getRecommendationsByDoctor(doctor.getId());
    }

    @GetMapping("/patient/{patientId}/progress")
    public ProgressResponse getPatientProgress(@PathVariable("patientId") Long patientId) {
        Doctor doctor = getAuthenticatedDoctor();
        // Check patient belongs to doctor safely
        Patient patient = patientRepository.findById(patientId).orElse(null);
        if (patient == null || patient.getDoctor() == null || !patient.getDoctor().getId().equals(doctor.getId())) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Patient is not actively assigned to this doctor");
        }
        
        java.util.List<com.vision.vision_app_backend.entity.ExerciseSession> sessions = sessionRepository.findByPatientId(patient.getId());
        java.util.List<ProgressResponse.ExerciseSessionData> sessionElements = new java.util.ArrayList<>();
        
        double totalAcc = 0;
        double totalImp = 0;
        int validSessions = 0;
        
        for (com.vision.vision_app_backend.entity.ExerciseSession session : sessions) {
            java.util.List<com.vision.vision_app_backend.entity.ExerciseResult> results = resultRepository.findBySessionId(session.getId());
            if (!results.isEmpty()) {
                com.vision.vision_app_backend.entity.ExerciseResult res = results.get(0);
                com.vision.vision_app_backend.entity.Exercise ex = exerciseRepository.findById(session.getExerciseId()).orElse(null);
                
                ProgressResponse.ExerciseSessionData se = new ProgressResponse.ExerciseSessionData();
                se.setSessionId(session.getId());
                se.setExerciseName(ex != null ? ex.getName() : "Unknown");
                se.setStartTime(session.getStartTime());
                se.setFocusDuration(res.getFocusDuration());
                se.setAccuracy(res.getAccuracy());
                se.setMovementScore(res.getMovementScore());
                se.setImprovementScore(res.getImprovementScore());
                
                totalAcc += res.getAccuracy() != null ? res.getAccuracy() : 0;
                totalImp += res.getImprovementScore() != null ? res.getImprovementScore() : 0;
                validSessions++;
                
                sessionElements.add(se);
            }
        }
        
        ProgressResponse response = new ProgressResponse();
        response.setPatientId(patient.getId());
        response.setPatientName(patient.getName());
        response.setTotalSessions(validSessions);
        response.setAverageAccuracy(validSessions > 0 ? totalAcc / validSessions : 0.0);
        response.setAverageImprovementScore(validSessions > 0 ? totalImp / validSessions : 0.0);
        response.setSessions(sessionElements);
        return response;
    }

    @GetMapping("/appointments")
    public List<AppointmentResponse> getAppointments() {
        Doctor doctor = getAuthenticatedDoctor();
        return appointmentService.getAppointmentsByDoctor(doctor.getId());
    }

    @PutMapping("/appointments/{id}/status")
    public AppointmentResponse updateAppointmentStatus(@PathVariable("id") Long id, @RequestBody java.util.Map<String, String> body) {
        Doctor doctor = getAuthenticatedDoctor();
        String newStatus = body.get("status");
        if (newStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }
        // Validate allowed status values
        Set<String> allowed = Set.of("CONFIRMED", "DECLINED", "CANCELLED", "COMPLETED");
        if (!allowed.contains(newStatus.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value: " + newStatus);
        }
        // Verify the appointment belongs to the authenticated doctor
        com.vision.vision_app_backend.entity.Appointment appointment = appointmentService.getAppointmentById(id);
        
        System.out.println("DEBUG: Authenticated Doctor ID=" + (doctor != null ? doctor.getId() : "null"));
        if (appointment != null) {
            System.out.println("DEBUG: Target Appt ID=" + id + ", DB Appt Doctor ID=" + appointment.getDoctorId());
        } else {
            System.out.println("DEBUG: Target Appt ID=" + id + " NOT FOUND in database");
        }

        if (appointment == null || !doctor.getId().equals(appointment.getDoctorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Appointment does not belong to this doctor");
        }
        return appointmentService.updateAppointmentStatus(id, newStatus.toUpperCase());
    }
}