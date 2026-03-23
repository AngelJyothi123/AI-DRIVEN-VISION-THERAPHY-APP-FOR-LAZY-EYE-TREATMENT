package com.vision.vision_app_backend.repository;

import com.vision.vision_app_backend.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    
    List<Recommendation> findByDoctorId(Long doctorId);
    
    List<Recommendation> findByPatientId(Long patientId);
    
    List<Recommendation> findByDoctorIdAndPatientId(Long doctorId, Long patientId);
}
