package com.vision.vision_app_backend.controller;

import com.vision.vision_app_backend.dto.ChatRequest;
import com.vision.vision_app_backend.entity.ChatMessage;
import com.vision.vision_app_backend.repository.DoctorRepository;
import com.vision.vision_app_backend.repository.PatientRepository;
import com.vision.vision_app_backend.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public ChatController(ChatService chatService, 
                          DoctorRepository doctorRepository, 
                          PatientRepository patientRepository) {
        this.chatService = chatService;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    private String getCurrentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            return ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername();
        }
        return auth.getPrincipal().toString();
    }

    @PostMapping("/send")
    public ChatMessage sendMessage(@RequestBody ChatRequest request) {
        String email = getCurrentEmail();
        
        // Try to find as Doctor first
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            return chatService.sendMessage(doctorOpt.get().getId(), request.getReceiverId(), "DOCTOR", request.getContent());
        }
        
        // Try to find as Patient
        var patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent()) {
            return chatService.sendMessage(patientOpt.get().getId(), request.getReceiverId(), "PATIENT", request.getContent());
        }
        
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User profile not found");
    }

    @GetMapping("/history/{otherId}")
    public List<ChatMessage> getHistory(@PathVariable("otherId") Long otherId) {
        String email = getCurrentEmail();
        Long myId = null;

        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) myId = doctorOpt.get().getId();
        
        if (myId == null) {
            var patientOpt = patientRepository.findByEmail(email);
            if (patientOpt.isPresent()) myId = patientOpt.get().getId();
        }

        if (myId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User profile not found");

        return chatService.getConversation(myId, otherId);
    }
}
