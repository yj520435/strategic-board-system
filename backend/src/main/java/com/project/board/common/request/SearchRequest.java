package com.project.board.common.request;

import lombok.Data;

@Data
public class SearchRequest {
  private Integer offset;
  private Integer limit;
}
