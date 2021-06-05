package com.iwaodev.infrastructure.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.iwaodev.domain.user.UserTypeEnum;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@Entity(name="user_types")
public class UserType {

  @Id
  private Long userTypeId;

  @Enumerated(EnumType.STRING)
  @Column(name="user_type")
  private UserTypeEnum userType;

  /**
   * #TODO: should I use ArrayList?? there might be better data structure.
   **/

  /**
   *  the value of mappedBy is variable name of the other one
   *  
   *  - ex)
   *    users: a variable name which must exist in User class 
   **/

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "userType", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<User> users = new ArrayList<>();

  public void setUsers(List<User> users) {
    this.users = users;

    for (User user : users) {
      user.setUserType(this);
    }
  }

}

