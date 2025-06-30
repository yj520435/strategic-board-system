# 1단계: Gradle로 빌드
FROM gradle:8.14-jdk21 AS builder
WORKDIR /app

COPY --chown=gradle:gradle . .

# build.gradle에 bootJar가 설정되어 있어야 함
RUN gradle bootJar --no-daemon

# 2단계: 실행 이미지 (Slim한 JRE 이미지 사용)
FROM openjdk:26-jdk-slim
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]