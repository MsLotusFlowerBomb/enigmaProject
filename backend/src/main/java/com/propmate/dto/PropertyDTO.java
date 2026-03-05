package com.propmate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    private Long id;
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
    private String landlordName;
    private Long landlordId;
    private boolean available;
    private LocalDateTime createdAt;
}
