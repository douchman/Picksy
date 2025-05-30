# 베이스 이미지 선택 (Java 17 사용 예시)
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app/picksy-app

# 빌드된 JAR 파일을 컨테이너로 복사
COPY build/libs/picksy.jar picksy-app.jar

# 배포용 API 주소 파일 config-prod.js 를 config.js 로 복사
COPY src/main/resources/static/global/api/config-prod.js \
     src/main/resources/static/global/api/config.js

# 컨테이너 실행 시 실행할 명령어 지정
ENTRYPOINT ["java", "-jar", "picksy-app.jar"]
