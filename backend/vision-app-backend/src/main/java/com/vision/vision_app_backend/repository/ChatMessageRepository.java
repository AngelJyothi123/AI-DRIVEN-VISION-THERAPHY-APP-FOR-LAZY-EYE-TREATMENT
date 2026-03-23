package com.vision.vision_app_backend.repository;

import com.vision.vision_app_backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT c FROM ChatMessage c WHERE " +
           "(c.senderId = :id1 AND c.receiverId = :id2) OR " +
           "(c.senderId = :id2 AND c.receiverId = :id1) " +
           "ORDER BY c.timestamp ASC")
    List<ChatMessage> findConversation(@Param("id1") Long id1, @Param("id2") Long id2);
}
