FROM maven:3-amazoncorretto-21-alpine AS build
WORKDIR /app
COPY . .

# IMPORTANT we skip tests usually to ensure Maven can compile the application
RUN ./mvnw clean package -DskipTests

FROM amazoncorretto:21-alpine-jdk
EXPOSE 8080
RUN addgroup -S websocket && adduser -S chess -G websocket
USER chess:websocket
ARG JAR_FILE=/app/target/*.jar
COPY --from=build ${JAR_FILE} /usr/bin/app.jar
ENTRYPOINT [ "java", "-jar", "/usr/bin/app.jar" ]
