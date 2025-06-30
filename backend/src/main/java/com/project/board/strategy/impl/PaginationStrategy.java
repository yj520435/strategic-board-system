package com.project.board.strategy.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import com.project.board.entity.Post;
import com.project.board.repository.PostRepository;
import com.project.board.strategy.LoadStrategy;
import com.project.board.strategy.enums.StrategyType;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaginationStrategy implements LoadStrategy {

  private final PostRepository postRepository;

  @Override
  public StrategyType getType() {
    return StrategyType.PAGE;
  }

  @Override
  public Page<Post> load(PageRequest pageRequest) {
    return postRepository.findPageBy(pageRequest);
  }
}
