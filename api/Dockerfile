# syntax=docker/dockerfile:1
FROM adoptopenjdk/openjdk11:x86_64-alpine-jdk-11.0.4_11 as production

# use spring-boot:build-image instead.
# spring-boot:build-image does not work. it said 'failed to launch: path lookup: exec: "java": executable file not found in $PATH'

ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} application.jar
ENTRYPOINT ["java","-jar","/application.jar"]
