package com.vision.vision_app_backend.repository;



import com.vision.vision_app_backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);
    List<Patient> findByDoctorId(Long doctorId);
}