package com.project.board.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.board.common.response.ApiResponse;
import com.project.board.dto.PostDto;
import com.project.board.service.PostService;
import com.project.board.strategy.enums.StrategyType;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pt")
@RequiredArgsConstructor
// @CrossOrigin
public class PostController {

  private final PostService postService;
  
  @GetMapping("/posts")
  public ResponseEntity<ApiResponse<Slice<PostDto>>> getList(
    @RequestParam("strategy") @Valid StrategyType type,
    @RequestParam("page") @Valid Integer page,
    @RequestParam("size") @Valid Integer size
  ) {
    PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("id").descending());
    Slice<PostDto> list = postService.getList(type, pageRequest);
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  @GetMapping("/post/{id}")
  public ResponseEntity<ApiResponse<PostDto>> getPostById(@PathVariable("id") Long id) {
    PostDto post = postService.getPostById(id);
    return ResponseEntity.ok(ApiResponse.success(post));
  }
}
