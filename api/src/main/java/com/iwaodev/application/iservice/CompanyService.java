package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.company.CompanyDTO;
import com.iwaodev.application.dto.company.PublicCompanyDTO;
import com.iwaodev.ui.criteria.user.UserCompanyCriteria;

public interface CompanyService {

  public List<CompanyDTO> get(UUID userId) throws Exception;

  public CompanyDTO update(UserCompanyCriteria criteria, UUID userId, Long companyId) throws Exception;

  public PublicCompanyDTO publicGet() throws Exception;

}


