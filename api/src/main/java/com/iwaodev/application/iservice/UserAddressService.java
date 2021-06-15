package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.ui.criteria.user.UserAddressCriteria;

public interface UserAddressService {

  public List<AddressDTO> getAll(UUID userId);

  public AddressDTO create(UserAddressCriteria criteria, UUID userId);

  public AddressDTO update(UserAddressCriteria criteria, UUID userId, Long addressId);

  public List<AddressDTO> toggleBillingAddress(UUID userId, Long addressId);

  public List<AddressDTO> toggleShippingAddress(UUID userId, Long addressId);

  public void delete(UUID userId, Long addressId);

}

