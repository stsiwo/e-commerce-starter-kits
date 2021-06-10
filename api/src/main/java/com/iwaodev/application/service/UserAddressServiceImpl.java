package com.iwaodev.application.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.UserAddressService;
import com.iwaodev.application.mapper.AddressMapper;
import com.iwaodev.infrastructure.model.Address;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserAddressCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserAddressServiceImpl implements UserAddressService {

  private static final Logger logger = LoggerFactory.getLogger(UserAddressServiceImpl.class);

  @Autowired
  private UserRepository repository;

  public List<AddressDTO> getAll(UUID userId) {
    logger.info("start handling a request at UserAddressServiceImpl");

    Optional<User> targetUserOption = this.repository.findById(userId);

    if (targetUserOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
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
  public AddressDTO create(UserAddressCriteria criteria, UUID userId) {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (targetUserOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // map criteria to entity
    Address newEntity = AddressMapper.INSTANCE.toAddressEntityFromAddressCriteria(criteria);

    // assign the entity to the user
    targetUserOption.get().addAddress(newEntity);

    // save
    User savedUser = this.repository.save(targetUserOption.get());

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
  public AddressDTO update(UserAddressCriteria criteria, UUID userId, Long addressId) {

    // make sure criteria.addressId is assigned
    // - criteria.addressId does not have validation since it is shared with /post
    // endpoint.
    if (criteria.getAddressId() == null) {
      criteria.setAddressId(addressId);
    }

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (targetUserOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check the user has the address of a given id
    boolean isTargetAddrssExist = targetUserOption.get().getAddresses().stream().anyMatch(address -> {
      return address.getAddressId().equals(addressId);
    });

    logger.info("target address exists?: " + isTargetAddrssExist);

    if (!isTargetAddrssExist) {
      logger.info("the given address does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given address does not exist.");
    }
    // create updated entity
    Address updateAddress = AddressMapper.INSTANCE.toAddressEntityFromAddressCriteria(criteria);

    /**
     * @TODO; I don't know this is correct way to update child collection - there
     * must be better way to do this.
     *
     * - or do i need to use AddressRepository?
     **/
    targetUserOption.get().removeAddressById(addressId);

    targetUserOption.get().addAddress(updateAddress);

    // save it
    this.repository.save(targetUserOption.get());

    // find updated entity
    Address targetAddress = targetUserOption.get().findAddress(addressId);

    return AddressMapper.INSTANCE.toAddressDTO(targetAddress);
  }

  @Override
  public List<AddressDTO> toggleBillingAddress(UUID userId, Long addressId) {
    
    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (targetUserOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetUserOption.get();

    targetEntity.toggleBillingAddress(addressId);

    User updatedTargetEntity = this.repository.save(targetEntity);

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
  public List<AddressDTO> toggleShippingAddress(UUID userId, Long addressId) {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (targetUserOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetUserOption.get();

    targetEntity.toggleShippingAddress(addressId);

    User updatedTargetEntity = this.repository.save(targetEntity);

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
  public void delete(UUID userId, Long addressId) {

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (targetUserOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    targetUserOption.get().removeAddressById(addressId);

    this.repository.save(targetUserOption.get());

  }

}
