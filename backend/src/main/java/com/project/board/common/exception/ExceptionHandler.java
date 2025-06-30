package com.project.board.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.project.board.common.response.ApiResponse;

@RestControllerAdvice
public class ExceptionHandler {
  
  public ResponseEntity<ApiResponse<?>> handlePostNotFound(PostNotFoundException ex) {
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(ApiResponse.fail(ex.getMessage()));
  }
}
