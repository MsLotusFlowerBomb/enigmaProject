package com.propmate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePropertyRequest {
    private String title;
    private String address;
    private String city;
    private String province;
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal price;
    private String propertyType;
    private String description;
    private String imageUrl;
    private Long landlordId;
    private boolean available = true;
}
