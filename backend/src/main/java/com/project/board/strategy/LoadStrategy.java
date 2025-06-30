package com.project.board.strategy;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

import com.project.board.entity.Post;
import com.project.board.strategy.enums.StrategyType;

public interface LoadStrategy {
  StrategyType getType();
  Slice<Post> load(PageRequest pageRequest);
}
