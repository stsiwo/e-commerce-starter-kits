package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.application.dto.user.CompanyDTO;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.ReviewDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.dto.user.UserTypeDTO;
import com.iwaodev.infrastructure.model.Address;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.ui.criteria.UserCriteria;
import com.iwaodev.ui.criteria.UserSignupCriteria;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toUserDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setUserId( user.getUserId() );
        userDTO.setFirstName( user.getFirstName() );
        userDTO.setLastName( user.getLastName() );
        userDTO.setEmail( user.getEmail() );
        userDTO.setAvatarImagePath( user.getAvatarImagePath() );
        userDTO.setIsDeleted( user.getIsDeleted() );
        userDTO.setDeletedAccountDate( user.getDeletedAccountDate() );
        userDTO.setDeletedAccountReason( user.getDeletedAccountReason() );
        userDTO.setUserType( userTypeToUserTypeDTO( user.getUserType() ) );
        userDTO.setCreatedAt( user.getCreatedAt() );
        userDTO.setUpdatedAt( user.getUpdatedAt() );
        userDTO.setPhones( phoneListToPhoneDTOList( user.getPhones() ) );
        userDTO.setAddresses( addressListToAddressDTOList( user.getAddresses() ) );
        userDTO.setReviews( reviewListToReviewDTOList( user.getReviews() ) );
        userDTO.setCompanies( companyListToCompanyDTOList( user.getCompanies() ) );

        return userDTO;
    }

    @Override
    public User toUserEntityFromUserSignupCriteria(UserSignupCriteria user) {
        if ( user == null ) {
            return null;
        }

        User user1 = new User();

        user1.setFirstName( user.getFirstName() );
        user1.setLastName( user.getLastName() );
        user1.setEmail( user.getEmail() );
        user1.setPassword( user.getPassword() );

        return user1;
    }

    @Override
    public User toUserEntityFromUserCriteria(UserCriteria user) {
        if ( user == null ) {
            return null;
        }

        User user1 = new User();

        user1.setUserId( user.getUserId() );
        user1.setFirstName( user.getFirstName() );
        user1.setLastName( user.getLastName() );
        user1.setEmail( user.getEmail() );
        user1.setPassword( user.getPassword() );

        return user1;
    }

    protected UserTypeDTO userTypeToUserTypeDTO(UserType userType) {
        if ( userType == null ) {
            return null;
        }

        UserTypeDTO userTypeDTO = new UserTypeDTO();

        userTypeDTO.setUserTypeId( userType.getUserTypeId() );
        if ( userType.getUserType() != null ) {
            userTypeDTO.setUserType( userType.getUserType().name() );
        }

        return userTypeDTO;
    }

    protected PhoneDTO phoneToPhoneDTO(Phone phone) {
        if ( phone == null ) {
            return null;
        }

        PhoneDTO phoneDTO = new PhoneDTO();

        phoneDTO.setPhoneId( phone.getPhoneId() );
        phoneDTO.setPhoneNumber( phone.getPhoneNumber() );
        phoneDTO.setCountryCode( phone.getCountryCode() );
        phoneDTO.setIsSelected( phone.getIsSelected() );

        return phoneDTO;
    }

    protected List<PhoneDTO> phoneListToPhoneDTOList(List<Phone> list) {
        if ( list == null ) {
            return null;
        }

        List<PhoneDTO> list1 = new ArrayList<PhoneDTO>( list.size() );
        for ( Phone phone : list ) {
            list1.add( phoneToPhoneDTO( phone ) );
        }

        return list1;
    }

    protected AddressDTO addressToAddressDTO(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDTO addressDTO = new AddressDTO();

        addressDTO.setAddressId( address.getAddressId() );
        addressDTO.setAddress1( address.getAddress1() );
        addressDTO.setAddress2( address.getAddress2() );
        addressDTO.setCity( address.getCity() );
        addressDTO.setProvince( address.getProvince() );
        addressDTO.setCountry( address.getCountry() );
        addressDTO.setPostalCode( address.getPostalCode() );
        addressDTO.setIsBillingAddress( address.getIsBillingAddress() );
        addressDTO.setIsShippingAddress( address.getIsShippingAddress() );
        addressDTO.setCreatedAt( address.getCreatedAt() );
        addressDTO.setUpdatedAt( address.getUpdatedAt() );

        return addressDTO;
    }

    protected List<AddressDTO> addressListToAddressDTOList(List<Address> list) {
        if ( list == null ) {
            return null;
        }

        List<AddressDTO> list1 = new ArrayList<AddressDTO>( list.size() );
        for ( Address address : list ) {
            list1.add( addressToAddressDTO( address ) );
        }

        return list1;
    }

    protected ReviewDTO reviewToReviewDTO(Review review) {
        if ( review == null ) {
            return null;
        }

        ReviewDTO reviewDTO = new ReviewDTO();

        reviewDTO.setReviewId( review.getReviewId() );
        reviewDTO.setReviewPoint( review.getReviewPoint() );
        reviewDTO.setReviewTitle( review.getReviewTitle() );
        reviewDTO.setReviewDescription( review.getReviewDescription() );
        if ( review.getIsVerified() != null ) {
            reviewDTO.setIsVerified( String.valueOf( review.getIsVerified() ) );
        }
        reviewDTO.setCreatedAt( review.getCreatedAt() );
        reviewDTO.setUpdatedAt( review.getUpdatedAt() );

        return reviewDTO;
    }

    protected List<ReviewDTO> reviewListToReviewDTOList(List<Review> list) {
        if ( list == null ) {
            return null;
        }

        List<ReviewDTO> list1 = new ArrayList<ReviewDTO>( list.size() );
        for ( Review review : list ) {
            list1.add( reviewToReviewDTO( review ) );
        }

        return list1;
    }

    protected CompanyDTO companyToCompanyDTO(Company company) {
        if ( company == null ) {
            return null;
        }

        CompanyDTO companyDTO = new CompanyDTO();

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

    protected List<CompanyDTO> companyListToCompanyDTOList(List<Company> list) {
        if ( list == null ) {
            return null;
        }

        List<CompanyDTO> list1 = new ArrayList<CompanyDTO>( list.size() );
        for ( Company company : list ) {
            list1.add( companyToCompanyDTO( company ) );
        }

        return list1;
    }
}
