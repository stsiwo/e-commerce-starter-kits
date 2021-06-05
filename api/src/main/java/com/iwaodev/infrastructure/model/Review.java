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

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name = "review_id")
  private Long reviewId;

  @Column(name = "review_point")
  private Double reviewPoint;

  @Column(name = "review_title")
  private String reviewTitle;

  @Column(name = "review_description")
  private String reviewDescription;

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

  @ManyToOne
  @JoinColumn(
    name = "user_id", 
    foreignKey = @ForeignKey(name = "FK_reviews_users"),
    insertable = true,
    updatable = false
    )
  private User user;

  @ManyToOne
  @JoinColumn(
    name = "product_id", 
    foreignKey = @ForeignKey(name = "FK_reviews_products"),
    insertable = true,
    updatable = false
    )
  private Product product;

}
