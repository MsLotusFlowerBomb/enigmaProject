package com.propmate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InspectionResponse {
    private String fileName;
    private List<String> detectedDamages;
    private double totalRepairCost;
    private double depositDeductionAmount;
    private String recommendation;
    private String analysisStatus;
}
