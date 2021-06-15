package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.iwaodev.infrastructure.model.listener.UserPhoneValidationListener;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@EntityListeners(UserPhoneValidationListener.class)
@Entity(name = "phones")
public class Phone {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "phone_id")
  private Long phoneId;

  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "country_code")
  private String countryCode = "+1";

  @Column(name = "extension")
  private String extension;

  @Column(name = "is_selected")
  private Boolean isSelected;

  @ManyToOne
  @JoinColumn(
    name = "user_id", 
    foreignKey = @ForeignKey(name = "FK_phones__users"),
    insertable = true,
    updatable = true // make this true since we want to update this with user together
    )
  private User user;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  public Phone(Long phoneId, String phoneNumber, String countryCode, Boolean isSelected) {
    this.phoneId = phoneId;
    this.phoneNumber = phoneNumber;
    this.countryCode = countryCode;
    this.isSelected = isSelected;
  }

}
