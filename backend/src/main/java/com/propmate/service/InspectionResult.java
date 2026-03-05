package com.propmate.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InspectionResult {
    private List<String> detectedDamages;
    private double totalRepairCost;
    private double depositDeductionAmount;
    private String recommendation;
}
