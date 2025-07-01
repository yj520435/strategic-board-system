# 전략 패턴 기반 게시판 시스템

## 개요

전략 패턴을 활용하여 로딩 전략(페이지네이션 또는 무한 스크롤)을 선택적으로 제공하는 게시판 시스템입니다.

## 실행 방법

```bash
git clone https://github.com/yj520435/strategic-board-system.git
cd strategic-board-system
docker-compose up --build
```

## 실행 주소

* 프론트엔드: http://localhost:3000
* 백엔드(API): http://localhost:8080/pt

## 기술 스택

### Back-end

* Java21
* Spring Boot 3.5.3
* JPA
* H2 Database

### Front-end

* React 19
* Material-UI

## 요구 사항

### RESTful API 설계

```java
@RestController
@RequestMapping("/pt")
@RequiredArgsConstructor
public class PostController {

  private final PostService postService;
  
  @GetMapping("/posts")
  public ResponseEntity<ApiResponse<Slice<PostDto>>> getList(/* args */) {
    // Get All Posts
  }

  @GetMapping("/post/{id}")
  public ResponseEntity<ApiResponse<PostDto>> getPostById(@PathVariable("id") Long id) {
    // Get Post
  }
}
```

### 게시글 리스트 삽입

`import.sql` 파일을 통해 서버 실행 시 50개의 게시글 리스트를 삽입합니다.

```sql
INSERT INTO post(title, content, author, created_at)
  SELECT
    'Title' as TITLE,
    '...' as CONTENT,
    CONCAT('anonymous', MOD(X, 9) + 1) as AUTHOR,
    (TIMESTAMP '2025-01-01 00:00:00' + (CURRENT_TIMESTAMP - TIMESTAMP '2025-01-01 00:00:00') * RAND()) AS CREATED_AT
  FROM (SELECT X FROM SYSTEM_RANGE(1, 50))
  ORDER BY CREATED_AT ASC
```

### 전략 패턴 적용

* 인터페이스 (LoadStrategy)

```java
public interface LoadStrategy {
  StrategyType getType();
  Slice<Post> load(PageRequest pageRequest);
}
```

* 구현체

```java
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
```
