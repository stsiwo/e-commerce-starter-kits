package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
//@EntityListeners(UserPhoneValidationListener.class)
@Entity(name = "phones")
public class Phone {

  @Null(message = "{phone.id.null}", groups = OnCreate.class)
  @NotNull(message = "{phone.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "phone_id")
  private Long phoneId;

  @NotEmpty(message = "{phone.phoneNumber.notempty}")
  @Pattern( regexp = "^[0-9]{10}$", message = "{phone.phoneNumber.invalidformat}")
  @Column(name = "phone_number")
  private String phoneNumber;

  @NotEmpty(message = "{phone.countryCode.notempty}")
  @Pattern( regexp = "^(\\+?\\d{1,3}|\\d{1,4})$", message = "{phone.countryCode.invalidformat}")
  @Column(name = "country_code")
  private String countryCode = "+1";

  @Column(name = "extension")
  private String extension;

  @NotNull(message = "{phone.isSelected.notnul}")
  @Column(name = "is_selected")
  private Boolean isSelected;

  @NotNull(message = "{phone.user.notnul}")
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
