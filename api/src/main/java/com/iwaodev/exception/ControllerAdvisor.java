package com.iwaodev.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import com.iwaodev.ui.response.ErrorBaseResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {

  /**
   * all javax.validation errors are caught by here for Hibernate Entity classes)
   **/
  // @ExceptionHandler(ConstraintViolationException.class)
  // public ResponseEntity<Object>
  // handleConstraintViolationException(ConstraintViolationException ex,
  // WebRequest request) {

  // Map<String, Object> body = new LinkedHashMap<>();
  // body.put("timestamp", LocalDateTime.now());
  // body.put("message", ex.getMessage());

  // return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  // }

  /**
   * criteria binding error (at controller).
   *
   * - you cannot '' since Spring already has the method to handle that exception.
   * you get an error: Ambiguous @ExceptionHandler method mapped for [class
   * org.springframework.web.bind.MethodArgumentNotValidException].
   *
   * - instead, you need to override that method.
   *
   * ref:
   * https://stackoverflow.com/questions/16651160/spring-rest-errorhandling-controlleradvice-valid
   *
   **/
  @Override
  public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,
      HttpStatus status, WebRequest request) {

    /**
     * to match response body to AppException.
     *
     * I couldn't find any better way to do this.
     *
     **/
    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(),
        HttpStatus.BAD_REQUEST.toString(), ex.getBindingResult().getAllErrors().get(0).getDefaultMessage(),
        ((ServletWebRequest) request).getRequest().getRequestURI());

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(AppException.class)
  public ResponseEntity<Object> handleConstraintViolationException(AppException ex, WebRequest request) {
    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), ex.getStatus().value(),
        ex.getStatus().toString(), ex.getMessage(), ((ServletWebRequest) request).getRequest().getRequestURI());

    return new ResponseEntity<>(errorResponse, ex.getStatus());
  }
}
