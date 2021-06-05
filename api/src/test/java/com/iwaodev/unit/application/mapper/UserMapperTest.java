package com.iwaodev.unit.application.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserCriteria;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class UserMapperTest {

  private static final Logger logger = LoggerFactory.getLogger(UserMapperTest.class);

  @Test
  public void shouldReturnUserEntityEvenIfDTODoesNotHavePasswordValue() throws Exception {

    // arrange
    UserCriteria dummyCriteria = new UserCriteria();
    dummyCriteria.setFirstName("Satoshi");
    dummyCriteria.setLastName("Iwao");
    dummyCriteria.setEmail("email@email.com");
    dummyCriteria.setPassword("aaaaaaa");
    
    // act
    User user = UserMapper.INSTANCE.toUserEntityFromUserCriteria(dummyCriteria);

    // assert
    assertThat(user.getFirstName()).isEqualTo("Satoshi");
  }

}


