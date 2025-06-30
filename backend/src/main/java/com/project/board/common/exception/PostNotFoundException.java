package com.project.board.common.exception;

public class PostNotFoundException extends RuntimeException {
  public PostNotFoundException(Long id) {
    super("해당 ID의 게시글을 찾을 수 없습니다: " + id);
  }
}
