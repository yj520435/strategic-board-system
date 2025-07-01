package com.project.board.dto;

import java.time.LocalDateTime;

import com.project.board.entity.Post;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostDto {
  private Long id;
  private String title;
  private String content;
  private String author;
  private LocalDateTime createdAt;

  public static PostDto from(Post post) {
    return new PostDto(
      post.getId(),
      post.getTitle(),
      post.getContent(),
      post.getAuthor(),
      post.getCreatedAt()
    );
  }
}
