package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.UUID;

@NoArgsConstructor
@Data
@ToString
public class StatisticTopUserDTO {

    private UUID userId;
    private String userFirstName;
    private String userLastName;
    private String userAvatarImagePath;
    private BigDecimal totalSpend;

    public StatisticTopUserDTO(UUID userId, String userFirstName, String userLastName, String userAvatarImagePath, BigDecimal totalSpend) {
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userAvatarImagePath = userAvatarImagePath;
        this.totalSpend = totalSpend;
    }
}
