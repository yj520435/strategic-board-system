package com.project.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.CrudRepository;

import com.project.board.dto.PostDto;
import com.project.board.entity.Post;

public interface PostRepository extends CrudRepository<Post, Long> {

  Page<Post> findPageBy(Pageable pageable);
  Slice<Post> findSliceBy(Pageable pageable);
}
