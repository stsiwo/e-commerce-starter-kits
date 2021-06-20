package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
//@EntityListeners(CategoryValidationListener.class)
@Entity(name = "categories")
public class Category {

  @Null(message = "{category.id.null}", groups = OnCreate.class)
  @NotNull(message = "{category.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  private Long categoryId;

  // unique validation at service layer
  @NotEmpty(message = "{category.name.notempty}")
  @Column(name = "category_name", unique = true)
  private String categoryName;

  @NotEmpty(message = "{category.description.notempty}")
  @Column(name = "category_description")
  private String categoryDescription;

  // unique validation at service layer
  @NotEmpty(message = "{category.path.notempty}")
  @Column(name = "category_path", unique = true)
  private String categoryPath;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  /**
   * the value of mappedBy is variable name of the other one
   * 
   * - ex) users: a variable name which must exist in User class
   **/

  @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<Product> products = new ArrayList<>();

}
