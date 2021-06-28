package com.iwaodev.application.dto.company;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanyDTO {

  private Long companyId;

  private String companyName;

  private String companyDescription;

  private String companyEmail;

  private String phoneNumber;

  private String countryCode;

  private String address1;

  private String address2;

  private String city;

  private String province;

  private String country;

  private String postalCode;

  private UUID userId;

  private String facebookLink;

  private String instagramLink;

  private String twitterLink;

  private String youtubeLink;
}

