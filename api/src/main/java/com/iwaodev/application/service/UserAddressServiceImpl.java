package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.UserAddressService;
import com.iwaodev.application.mapper.AddressMapper;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Address;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.user.UserAddressCriteria;

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
public class UserAddressServiceImpl implements UserAddressService {

  private static final Logger logger = LoggerFactory.getLogger(UserAddressServiceImpl.class);

  @Autowired
  private HttpServletRequest httpServletRequest;

  @Autowired
  private UserRepository repository;

  public List<AddressDTO> getAll(UUID userId) throws Exception {
    logger.debug("start handling a request at UserAddressServiceImpl");

    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // use this rather than the list method since @Mapping for the list does not
    // work.
    return targetUserOption.get().getAddresses().stream().map(new Function<Address, AddressDTO>() {

      @Override
      public AddressDTO apply(Address address) {
        return AddressMapper.INSTANCE.toAddressDTO(address);
      }
    }).collect(Collectors.toList());

    // return
    // AddressMapper.INSTANCE.toAddressDTOList(targetUserOption.get().getAddresses());

  }

  @Override
  public AddressDTO create(UserAddressCriteria criteria, UUID userId) throws Exception {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User user = targetUserOption.get();

    if (user.getAddresses().size() >= 3) {
      throw new AppException(HttpStatus.BAD_REQUEST, "user cannot have more than 3 addresses.");
    }

    // map criteria to entity
    Address newEntity = AddressMapper.INSTANCE.toAddressEntityFromAddressCriteria(criteria);

    // assign the entity to the user
    user.addAddress(newEntity);

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
    return AddressMapper.INSTANCE.toAddressDTO(savedUser.getLastestAddress());
  }

  @Override
  public AddressDTO update(UserAddressCriteria criteria, UUID userId, Long addressId) throws Exception {

    // make sure criteria.addressId is assigned
    // - criteria.addressId does not have validation since it is shared with /post
    // endpoint.
    if (criteria.getAddressId() == null) {
      criteria.setAddressId(addressId);
    }

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check the user has the address of a given id
    boolean isTargetAddrssExist = targetUserOption.get().getAddresses().stream().anyMatch(address -> {
      return address.getAddressId().equals(addressId);
    });

    if (!isTargetAddrssExist) {
      logger.debug("the given address does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given address does not exist.");
    }

    Address targetAddress = targetUserOption.get().findAddress(addressId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetAddress.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    /**
     * issue-k0rdIGEQ91U
     **/
    targetUserOption.get().updateAddress(
            addressId,
            criteria.getAddress1(),
            criteria.getAddress2(),
            criteria.getCity(),
            criteria.getProvince(),
            criteria.getCountry(),
            criteria.getPostalCode(),
            criteria.getIsBillingAddress(),
            criteria.getIsShippingAddress()
    );

    // save it
    User updatedUser;
    try {
      // don't forget flush otherwise version number is updated.
      updatedUser = this.repository.saveAndFlush(targetUserOption.get());
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // issue-v07rKsa0SO2
    logger.debug("after saved: " + updatedUser.getVersion());

    return AddressMapper.INSTANCE.toAddressDTO(updatedUser.findAddress(addressId));
  }

  @Override
  public List<AddressDTO> toggleBillingAddress(UUID userId, Long addressId) throws Exception {
    
    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetUserOption.get();

    Address targetAddress = targetUserOption.get().findAddress(addressId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetAddress.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    targetEntity.toggleBillingAddress(addressId);

    User updatedTargetEntity;
    try {
      // don't forget flush otherwise version number is updated.
      updatedTargetEntity = this.repository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // use this rather than the list method since @Mapping for the list does not
    // work.
    return updatedTargetEntity.getAddresses().stream().map(new Function<Address, AddressDTO>() {

      @Override
      public AddressDTO apply(Address address) {
        return AddressMapper.INSTANCE.toAddressDTO(address);
      }
    }).collect(Collectors.toList());
  }

  @Override
  public List<AddressDTO> toggleShippingAddress(UUID userId, Long addressId) throws Exception {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetUserOption.get();

    Address targetAddress = targetUserOption.get().findAddress(addressId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetAddress.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    targetEntity.toggleShippingAddress(addressId);

    User updatedTargetEntity;
    try {
      // don't forget flush otherwise version number is updated.
      updatedTargetEntity = this.repository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // use this rather than the list method since @Mapping for the list does not
    // work.
    return updatedTargetEntity.getAddresses().stream().map(new Function<Address, AddressDTO>() {

      @Override
      public AddressDTO apply(Address address) {
        return AddressMapper.INSTANCE.toAddressDTO(address);
      }
    }).collect(Collectors.toList());
  }

  @Override
  public void delete(UUID userId, Long addressId) throws Exception {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    Address targetAddress = targetUserOption.get().findAddress(addressId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetAddress.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    targetUserOption.get().removeAddressById(addressId);

    try {
      this.repository.save(targetUserOption.get());
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }
  }

}
