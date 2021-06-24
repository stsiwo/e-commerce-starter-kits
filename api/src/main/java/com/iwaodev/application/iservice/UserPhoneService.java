package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.ui.criteria.user.UserPhoneCriteria;

public interface UserPhoneService {

  public List<PhoneDTO> getAll(UUID userId) throws Exception;

  public PhoneDTO create(UserPhoneCriteria criteria, UUID userId) throws Exception;

  public PhoneDTO update(UserPhoneCriteria criteria, UUID userId, Long phoneId) throws Exception;

  public List<PhoneDTO> toggleSelection(UUID userId, Long phoneId) throws Exception;

  public void delete(UUID userId, Long phoneId) throws Exception;

}

