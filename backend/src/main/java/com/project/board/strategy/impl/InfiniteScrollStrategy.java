package com.project.board.strategy.impl;

import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.util.Converter;
import com.project.board.dto.PostDto;
import com.project.board.entity.Post;
import com.project.board.repository.PostRepository;
import com.project.board.strategy.LoadStrategy;
import com.project.board.strategy.enums.StrategyType;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InfiniteScrollStrategy implements LoadStrategy {

  private final PostRepository postRepository;

  @Override
  public StrategyType getType() {
    return StrategyType.SCROLL;
  }

  @Override
  public Slice<Post> load(PageRequest pageRequest) {
    return postRepository.findSliceBy(pageRequest);
  }
}
