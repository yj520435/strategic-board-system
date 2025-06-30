package com.project.board.service;

import java.util.Map;
import java.util.Objects;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project.board.common.exception.PostNotFoundException;
import com.project.board.dto.PostDto;
import com.project.board.entity.Post;
import com.project.board.repository.PostRepository;
import com.project.board.strategy.LoadStrategy;
import com.project.board.strategy.enums.StrategyType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
  private final Map<StrategyType, LoadStrategy> strategies;
  private final PostRepository postRepository;

  public Slice<PostDto> getList(StrategyType strategyType, PageRequest pageRequest) {
    LoadStrategy strategy = strategies.getOrDefault(strategyType, null);
    if (Objects.isNull(strategy)) {
      throw new IllegalArgumentException("Error");
    }
    Slice<Post> result = strategy.load(pageRequest);
    return result.map(PostDto::from);
  }

  public PostDto getPostById(Long id) {
    Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException(id));
    return PostDto.from(post);
  }
}