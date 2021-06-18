package com.iwaodev.infrastructure.repository;

import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iwaodev.application.irepository.AdvanceUserRepository;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.UserType;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


/**
 * any custom repository implementation must be registered with its target repository implementation name.
 *
 *
 * see note.md#CustomizedRepositoryImplementation more detail.
 *
 **/
@Component("userRepositoryImpl") // must be target repository implementation name
public class AdvanceUserRepositoryImpl implements AdvanceUserRepository {

  @PersistenceContext
  private EntityManager entityManager;

	@Override
	public Optional<UserType> findUserType(UserTypeEnum type) {
		return this.entityManager.createQuery("SELECT ut FROM user_types ut WHERE ut.userType = :userType", UserType.class)
      .setParameter("userType", type)
      .getResultList()
      .stream()
      .findFirst();
	}

	@Override
	public Boolean isDuplicateEmail(String email) {
		return this.entityManager.createQuery("select case when (count(u) > 0)  then true else false end from users u where u.email = :email", Boolean.class)
      .setParameter("email", email)
      .getSingleResult();
	}
}
