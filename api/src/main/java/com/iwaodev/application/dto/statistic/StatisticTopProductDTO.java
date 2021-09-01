package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@Data
@ToString
public class StatisticTopProductDTO {

    private UUID productId;
    private String productName;
    private String primaryImagePath;
    private Integer soldCount;

    public StatisticTopProductDTO(UUID productId, String productName, String primaryImagePath, Integer soldCount) {
        this.productId = productId;
        this.productName = productName;
        this.primaryImagePath = primaryImagePath;
        this.soldCount = soldCount;
    }
}
