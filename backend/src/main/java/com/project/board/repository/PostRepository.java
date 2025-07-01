package com.project.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.CrudRepository;

import com.project.board.entity.Post;
public interface PostRepository extends CrudRepository<Post, Long> {

  Page<Post> findAll(Pageable pageable);
  // Slice<Post> findSliceBy(Pageable pageable);
}
