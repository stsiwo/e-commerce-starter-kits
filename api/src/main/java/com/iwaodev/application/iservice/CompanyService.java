package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.company.CompanyDTO;
import com.iwaodev.ui.criteria.UserCompanyCriteria;

public interface CompanyService {

  public List<CompanyDTO> get(UUID userId);

  public CompanyDTO update(UserCompanyCriteria criteria, UUID userId, Long companyId);

}


