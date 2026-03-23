package com.vision.vision_app_backend.service;

import com.vision.vision_app_backend.entity.ChatMessage;
import com.vision.vision_app_backend.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatMessage sendMessage(Long senderId, Long receiverId, String senderRole, String content) {
        ChatMessage message = new ChatMessage();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setSenderRole(senderRole);
        message.setContent(content);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getConversation(Long id1, Long id2) {
        return chatMessageRepository.findConversation(id1, id2);
    }
}
