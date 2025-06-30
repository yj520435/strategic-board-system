package com.project.board.strategy.config;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.project.board.strategy.LoadStrategy;
import com.project.board.strategy.enums.StrategyType;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class StrategyConfig {
  
  private final List<LoadStrategy> strategies;

  @Bean
  Map<StrategyType, LoadStrategy> register() {
    Map<StrategyType, LoadStrategy> strategyMap = new EnumMap<>(StrategyType.class);
    strategies.forEach(loadStrategy -> strategyMap.put(
      loadStrategy.getType(),
      loadStrategy
    ));
    return strategyMap;
  }
}
