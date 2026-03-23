package com.vision.vision_app_backend.dto;

import lombok.Data;

@Data
public class DoctorRegisterRequest {

    private String name;
    private String email;
    private String phone;
    private String password;
    private String qualification;
    private String hospital;
}
