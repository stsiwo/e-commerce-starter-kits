package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.company.CompanyDTO;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserCompanyCriteria;
import java.util.UUID;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class CompanyMapperImpl implements CompanyMapper {

    @Override
    public CompanyDTO toCompanyDTO(Company company) {
        if ( company == null ) {
            return null;
        }

        CompanyDTO companyDTO = new CompanyDTO();

        companyDTO.setUserId( companyUserUserId( company ) );
        companyDTO.setCompanyId( company.getCompanyId() );
        companyDTO.setCompanyName( company.getCompanyName() );
        companyDTO.setCompanyDescription( company.getCompanyDescription() );
        companyDTO.setCompanyEmail( company.getCompanyEmail() );
        companyDTO.setPhoneNumber( company.getPhoneNumber() );
        companyDTO.setCountryCode( company.getCountryCode() );
        companyDTO.setAddress1( company.getAddress1() );
        companyDTO.setAddress2( company.getAddress2() );
        companyDTO.setCity( company.getCity() );
        companyDTO.setProvince( company.getProvince() );
        companyDTO.setCountry( company.getCountry() );
        companyDTO.setPostalCode( company.getPostalCode() );

        return companyDTO;
    }

    @Override
    public Company toCompanyEntityFromCompanyCriteria(UserCompanyCriteria company) {
        if ( company == null ) {
            return null;
        }

        Company company1 = new Company();

        company1.setCompanyId( company.getCompanyId() );
        company1.setCompanyName( company.getCompanyName() );
        company1.setCompanyDescription( company.getCompanyDescription() );
        company1.setCompanyEmail( company.getCompanyEmail() );
        company1.setPhoneNumber( company.getPhoneNumber() );
        company1.setCountryCode( company.getCountryCode() );
        company1.setAddress1( company.getAddress1() );
        company1.setAddress2( company.getAddress2() );
        company1.setCity( company.getCity() );
        company1.setProvince( company.getProvince() );
        company1.setCountry( company.getCountry() );
        company1.setPostalCode( company.getPostalCode() );

        return company1;
    }

    private UUID companyUserUserId(Company company) {
        if ( company == null ) {
            return null;
        }
        User user = company.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }
}
