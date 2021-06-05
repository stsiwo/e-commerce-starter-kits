package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserPhoneCriteria;
import java.util.UUID;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class PhoneMapperImpl implements PhoneMapper {

    @Override
    public PhoneDTO toPhoneDTO(Phone phone) {
        if ( phone == null ) {
            return null;
        }

        PhoneDTO phoneDTO = new PhoneDTO();

        phoneDTO.setUserId( phoneUserUserId( phone ) );
        phoneDTO.setPhoneId( phone.getPhoneId() );
        phoneDTO.setPhoneNumber( phone.getPhoneNumber() );
        phoneDTO.setCountryCode( phone.getCountryCode() );
        phoneDTO.setIsSelected( phone.getIsSelected() );

        return phoneDTO;
    }

    @Override
    public Phone toPhoneEntityFromPhoneCriteria(UserPhoneCriteria phone) {
        if ( phone == null ) {
            return null;
        }

        Phone phone1 = new Phone();

        phone1.setPhoneId( phone.getPhoneId() );
        phone1.setPhoneNumber( phone.getPhoneNumber() );
        phone1.setCountryCode( phone.getCountryCode() );
        phone1.setIsSelected( phone.getIsSelected() );

        return phone1;
    }

    private UUID phoneUserUserId(Phone phone) {
        if ( phone == null ) {
            return null;
        }
        User user = phone.getUser();
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
