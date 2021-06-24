package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.ui.criteria.user.UserAddressCriteria;

public interface UserAddressService {

  public List<AddressDTO> getAll(UUID userId) throws Exception;

  public AddressDTO create(UserAddressCriteria criteria, UUID userId) throws Exception;

  public AddressDTO update(UserAddressCriteria criteria, UUID userId, Long addressId) throws Exception;

  public List<AddressDTO> toggleBillingAddress(UUID userId, Long addressId) throws Exception;

  public List<AddressDTO> toggleShippingAddress(UUID userId, Long addressId) throws Exception;

  public void delete(UUID userId, Long addressId) throws Exception;

}

