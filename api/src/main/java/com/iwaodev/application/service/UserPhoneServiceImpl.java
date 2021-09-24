package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.UserPhoneService;
import com.iwaodev.application.mapper.PhoneMapper;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.user.UserPhoneCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class UserPhoneServiceImpl implements UserPhoneService {

  private static final Logger logger = LoggerFactory.getLogger(UserPhoneServiceImpl.class);

  @Autowired
  private UserRepository repository;

  @Autowired
  private HttpServletRequest httpServletRequest;

  public List<PhoneDTO> getAll(UUID userId) throws Exception {
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // use this rather than the list method since @Mapping for the list does not
    // work.
    return targetUserOption.get().getPhones().stream().map(new Function<Phone, PhoneDTO>() {

      @Override
      public PhoneDTO apply(Phone phone) {
        return PhoneMapper.INSTANCE.toPhoneDTO(phone);
      }
    }).collect(Collectors.toList());

    // return
    // PhoneMapper.INSTANCE.toPhoneDTOList(targetUserOption.get().getPhones());

  }

  @Override
  public PhoneDTO create(UserPhoneCriteria criteria, UUID userId) throws Exception {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User user = targetUserOption.get();

    // validate max phone 3
    if (user.getPhones().size() >= 3) {
      throw new AppException(HttpStatus.BAD_REQUEST, " user can't have more than 3 phones.");
    }

    // map criteria to entity
    Phone newEntity = PhoneMapper.INSTANCE.toPhoneEntityFromPhoneCriteria(criteria);

    // assign the entity to the user
    user.addPhone(newEntity);

    // save
    User savedUser = this.repository.saveAndFlush(user);

    /**
     * TODO: how to find the newly saved address with savedUser?
     *
     *  - solution1) compare the all properties to find the new one. => pain in my neck.
     *
     *  - solution2) if you use a list, pick the last element since the List perserve insertion order. => nice.
     *
     **/
    // map entity to dto
    return PhoneMapper.INSTANCE.toPhoneDTO(savedUser.getLastestPhone());
  }

  @Override
  public List<PhoneDTO> toggleSelection(UUID userId, Long phoneId) throws Exception {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetUserOption.get();

    Phone targetPhone = targetEntity.findPhone(phoneId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetPhone.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    targetEntity.togglePhoneSelection(phoneId);

    User updatedTargetEntity;
    try {
      updatedTargetEntity = this.repository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // use this rather than the list method since @Mapping for the list does not
    // work.
    return updatedTargetEntity.getPhones().stream().map(new Function<Phone, PhoneDTO>() {

      @Override
      public PhoneDTO apply(Phone phone) {
        return PhoneMapper.INSTANCE.toPhoneDTO(phone);
      }
    }).collect(Collectors.toList());

  }

  @Override
  public PhoneDTO update(UserPhoneCriteria criteria, UUID userId, Long phoneId) throws Exception {

    // make sure criteria.phoneId is assigned
    // - criteria.phoneId does not have validation since it is shared with /post
    // endpoint.
    if (criteria.getPhoneId() == null) {
      criteria.setPhoneId(phoneId);
    }

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check the user has the phone of a given id
    boolean isTargetAddrssExist = targetUserOption.get().getPhones().stream().anyMatch(phone -> {
      return phone.getPhoneId().equals(phoneId);
    });

    if (!isTargetAddrssExist) {
      logger.debug("the given phone does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given phone does not exist.");
    }

    Phone targetPhone = targetUserOption.get().findPhone(phoneId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetPhone.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    /**
     * issue-k0rdIGEQ91U
     **/
    targetUserOption.get().updatePhone(phoneId, criteria.getPhoneNumber(), criteria.getCountryCode(), criteria.getIsSelected());
    // save it
    User updatedUser;
    try {
      // don't forget flush otherwise version number is updated.
      updatedUser = this.repository.saveAndFlush(targetUserOption.get());
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    return PhoneMapper.INSTANCE.toPhoneDTO(updatedUser.findPhone(phoneId));
  }

  @Override
  public void delete(UUID userId, Long phoneId) throws Exception {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    Phone targetPhone = targetUserOption.get().findPhone(phoneId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetPhone.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    targetUserOption.get().removePhoneById(phoneId);

    try {
      this.repository.save(targetUserOption.get());
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

  }

}
