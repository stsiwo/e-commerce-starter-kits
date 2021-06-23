# syntax=docker/dockerfile:1
FROM adoptopenjdk/openjdk11:x86_64-alpine-jdk-11.0.4_11 as production
# don't use big docker image, it makes ec2 stuck. (e.g., maven:3.8.1-jdk-11-slim)

# use spring-boot:build-image instead.
# spring-boot:build-image does not work. it said 'failed to launch: path lookup: exec: "java": executable file not found in $PATH'

# don't need to run 'mvn package' here since jvm can work any where, so you can compile at local host.

# also, this image does not have mvn

ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} application.jar
ENTRYPOINT ["java","-jar","/application.jar"]
