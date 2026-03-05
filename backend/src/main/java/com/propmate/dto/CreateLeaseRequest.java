package com.propmate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLeaseRequest {
    private Long propertyId;
    private Long tenantId;
    private Long landlordId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
}
