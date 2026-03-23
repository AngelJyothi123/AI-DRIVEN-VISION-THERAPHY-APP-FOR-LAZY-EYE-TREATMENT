package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.dto.AppointmentRequest;
import com.vision.vision_app_backend.dto.AppointmentResponse;
import com.vision.vision_app_backend.entity.Appointment;
import com.vision.vision_app_backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public AppointmentResponse createAppointment(AppointmentRequest request, Long doctorId) {
        if (request.getAppointmentTime().isBefore(LocalDateTime.now())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Cannot book appointments in the past");
        }
        
        // Assume 30-minute slot increments. Prevent overlaps.
        List<Appointment> overlapping = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
            doctorId, 
            request.getAppointmentTime().minusMinutes(29), 
            request.getAppointmentTime().plusMinutes(29)
        );
        
        if (!overlapping.isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "Doctor is already booked for this time slot");
        }

        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(doctorId);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        
        // Generate a unique room ID for the virtual meeting
        appointment.setMeetingUrl("VisionTherapy-" + java.util.UUID.randomUUID().toString().substring(0, 8));
        
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    public List<AppointmentResponse> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsForDoctorInTimeRange(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(status);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(updatedAppointment);
    }
    
    // Retrieve raw Appointment entity for ownership validation
    public com.vision.vision_app_backend.entity.Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setPatientId(appointment.getPatientId());
        response.setDoctorId(appointment.getDoctorId());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setStatus(appointment.getStatus());
        
        // Ensure even legacy appointments have a valid Room ID in the response if confirmed
        String meetingUrl = appointment.getMeetingUrl();
        if ((meetingUrl == null || meetingUrl.isEmpty()) && "CONFIRMED".equals(appointment.getStatus())) {
            meetingUrl = "VisionTherapy-" + java.util.UUID.randomUUID().toString().substring(0, 8);
        }
        response.setMeetingUrl(meetingUrl);
        
        response.setCreatedAt(appointment.getCreatedAt());
        response.setUpdatedAt(appointment.getUpdatedAt());
        return response;
    }
}
