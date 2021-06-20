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
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
//@EntityListeners(ReviewValidationListener.class)
@Entity(name = "reviews")
@FilterDef(
    name = "verifiedFilter",
    parameters = @ParamDef(name = "isVerified", type = "boolean")
)
@Filter(
    name = "verifiedFilter",
    condition = "is_verified = :isVerified"
)
public class Review {

  @Null(message = "{review.id.null}", groups = OnCreate.class)
  @NotNull(message = "{review.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name = "review_id")
  private Long reviewId;

  @NotNull(message = "{review.point.notnull}")
  @DecimalMin(value = "0.0", message = "{review.point.min0}")
  @DecimalMax(value = "5.0", message = "{review.point.max5}")
  @Column(name = "review_point")
  private Double reviewPoint;

  @NotEmpty(message = "{review.title.notempty}")
  @Column(name = "review_title")
  private String reviewTitle;

  @NotEmpty(message = "{review.descripiton.notempty}")
  @Column(name = "review_description")
  private String reviewDescription;

  @NotNull(message = "{review.isVerified.notnull}")
  @Column(name = "is_verified")
  private Boolean isVerified;

  // only admin can see this.
  @Column(name = "note")
  private String note;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @NotNull(message = "{review.user.notnull}")
  @ManyToOne
  @JoinColumn(
    name = "user_id", 
    foreignKey = @ForeignKey(name = "FK_reviews_users"),
    insertable = true,
    updatable = false
    )
  private User user;

  @NotNull(message = "{review.product.notnull}")
  @ManyToOne
  @JoinColumn(
    name = "product_id", 
    foreignKey = @ForeignKey(name = "FK_reviews_products"),
    insertable = true,
    updatable = false
    )
  private Product product;

}
