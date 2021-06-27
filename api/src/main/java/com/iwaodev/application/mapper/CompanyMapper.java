package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.company.CompanyDTO;
import com.iwaodev.application.dto.company.PublicCompanyDTO;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.ui.criteria.user.UserCompanyCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CompanyMapper {

  CompanyMapper INSTANCE = Mappers.getMapper( CompanyMapper.class );

  @Mapping(source = "company.user.userId", target = "userId")
  CompanyDTO toCompanyDTO(Company company);
 
  @Mapping(source = "company.user.userId", target = "userId")
  PublicCompanyDTO toPublicCompanyDTO(Company company);
 
  Company toCompanyEntityFromCompanyCriteria(UserCompanyCriteria company);

}

