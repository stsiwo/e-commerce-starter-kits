package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.ui.criteria.UserPhoneCriteria;

public interface UserPhoneService {

  public List<PhoneDTO> getAll(UUID userId);

  public PhoneDTO create(UserPhoneCriteria criteria, UUID userId);

  public PhoneDTO update(UserPhoneCriteria criteria, UUID userId, Long phoneId);

  public List<PhoneDTO> toggleSelection(UUID userId, Long phoneId);

  public void delete(UUID userId, Long phoneId);

}

