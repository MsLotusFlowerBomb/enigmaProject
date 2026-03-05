package com.propmate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FraudAnalysisResponse {
    private Long propertyId;
    private String propertyTitle;
    private int riskScore;
    private String riskLevel;
    private String explanation;
    private boolean flagged;
    private List<String> recommendations;
}
