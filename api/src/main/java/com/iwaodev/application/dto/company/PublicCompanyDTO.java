package com.iwaodev.application.dto.company;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PublicCompanyDTO {

  private Long companyId;

  private String companyName;

  private String companyDescription;

  private String companyEmail;

  private UUID userId;
}


