package com.iwaodev.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import com.iwaodev.ui.response.ErrorBaseResponse;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

    logger.debug("got MethodArgumentNotValid (input validation error) so convert it to its message & status code to ResponseEntity");
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

  /**
   * handle maxUploadSizeExceededException
   * @param ex
   * @param request
   * @param response
   * @return
   */
  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<Object> handleMaxSizeException(
          MaxUploadSizeExceededException ex,
          HttpServletRequest request,
          HttpServletResponse response) {

    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.toString(), "the image is too big to upload.", request.getRequestURI());
    logger.debug(ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  /**
   * issue-UqNd_0_ndj9
   * @param ex
   * @param request
   * @return
   */
  @ExceptionHandler(AccessDeniedException.class)
  public final ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
    logger.debug("got AccessDeniedException so convert it to its message & status code to ResponseEntity");
    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), HttpStatus.FORBIDDEN.value(),
            HttpStatus.FORBIDDEN.toString(), ex.getMessage(), ((ServletWebRequest) request).getRequest().getRequestURI());
    return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
  }

  /**
   * issue-bG2CTHHBd6I
   * @param ex
   * @param request
   * @return
   */
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Object> handleresponseStatusException(ResponseStatusException ex, WebRequest request) {
    logger.debug("got ResponseStatusException so convert it to its message & status code to ResponseEntity");
    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), ex.getStatus().value(),
            ex.getStatus().toString(), ex.getReason(), ((ServletWebRequest) request).getRequest().getRequestURI());
    return new ResponseEntity<>(errorResponse, ex.getStatus());
  }


  @ExceptionHandler({ AppException.class })
  public ResponseEntity<Object> handleAppException(AppException ex, WebRequest request) {
    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), ex.getStatus().value(),
        ex.getStatus().toString(), ex.getMessage(), ((ServletWebRequest) request).getRequest().getRequestURI());
    logger.debug("got AppException so convert it to its message & status code to ResponseEntity");
    return new ResponseEntity<>(errorResponse, ex.getStatus());
  }

  /**
   * fallback exception handler.
   *
   * any expcetion thrown by this app is caught here and return 500 internal server error as a response
   * @param ex Exception
   * @param request WebRequest
   * @return ResponseEntity<Object>
   */
  @ExceptionHandler({ Exception.class })
  public ResponseEntity<Object> handleAll(Exception ex, WebRequest request) {
    logger.debug("got Exception so convert it to its message & status code to ResponseEntity");
    logger.debug("original error message for this exception.");
    logger.debug(ex.getMessage());
    logger.debug("original exception class");
    logger.debug(ex.getCause());
    logger.debug("abstract this message for clients");

    // issue-xzvLu2R0S1p
    if (ex.getCause() instanceof AppException) {
      AppException originalException = (AppException) ex.getCause();
      return this.handleAppException(originalException, request);
    }

    ErrorBaseResponse errorResponse = new ErrorBaseResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.toString(), "encountered errors. please try again.", ((ServletWebRequest) request).getRequest().getRequestURI());
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
