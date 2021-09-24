package com.iwaodev.infrastructure.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.iwaodev.infrastructure.model.listener.CategoryValidationListener;
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
@EntityListeners(CategoryValidationListener.class)
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
  @Size(max = 100, message = "{category.name.max100}")
  @Column(name = "category_name", unique = true)
  private String categoryName;

  @NotEmpty(message = "{category.description.notempty}")
  @Size(max = 10000, message = "{category.description.max10000}")
  @Column(name = "category_description")
  private String categoryDescription;

  // unique validation at service layer
  @NotEmpty(message = "{category.path.notempty}")
  @Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "{category.path.invalidformat}")
  @Size(max = 100, message = "{category.path.max100}")
  @Column(name = "category_path", unique = true)
  private String categoryPath;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Version
  @Column(name = "version")
  private Long version = 0L;

  /**
   * the value of mappedBy is variable name of the other one
   * 
   * - ex) users: a variable name which must exist in User class
   **/

  /**
   * orphanRemoval: when one of children is deleted (e.g., one of products which belong to this category is deleted from this category such as category.removeProduct(targetProduct), this product is deleted from db.
   *
   * CascadeType.Remove: this category is deleted, all products which belong to this category are also deleted.
   *
   **/
  @OneToMany(mappedBy = "category", cascade = {}, orphanRemoval = false)
  private List<Product> products = new ArrayList<>();

  public void update(Category newCategory) {
    this.categoryName = newCategory.getCategoryName();
    this.categoryDescription = newCategory.getCategoryDescription();
    this.categoryPath = newCategory.getCategoryPath();
  }
}
