package com.iwaodev.ui.criteria.user;

import java.time.LocalDateTime;
import java.util.Optional;

import com.iwaodev.domain.user.UserActiveEnum;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.ToString;

@ToString
public class UserQueryStringCriteria {

  private Optional<String> searchQuery;

  private Optional<UserActiveEnum> active;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private Optional<LocalDateTime> startDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private Optional<LocalDateTime> endDate;

  public UserQueryStringCriteria() {
    /**
     * need to set default value for each member otherwise nullpointer exception.
     *  - if there is no request param is specified, it does not assign any value to the property.
     *  - there might be better way such as @Default so that I don't need to specify in the constructor
     **/
    this.searchQuery = Optional.empty();
    this.active = Optional.empty();
    this.startDate = Optional.empty();
    this.endDate = Optional.empty();
  }

  public String getSearchQuery() {
    return this.searchQuery.orElse(null);
  }

  public void setSearchQuery(Optional<String> searchQuery) {
    this.searchQuery = searchQuery;
  }

  public UserActiveEnum getActive() {
    return this.active.orElse(null);
  }

  public void setActive(Optional<UserActiveEnum> active) {
    this.active = active;
  }

  public LocalDateTime getStartDate() {
    return this.startDate.orElse(null);
  }

  public void setStartDate(Optional<LocalDateTime> startDate) {
    this.startDate = startDate;
  }

  public LocalDateTime getEndDate() {
    return this.endDate.orElse(null);
  }

  public void setEndDate(Optional<LocalDateTime> endDate) {
    this.endDate = endDate;
  }
}
