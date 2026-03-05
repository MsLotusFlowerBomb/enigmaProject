package com.propmate.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FraudAnalysisResult {
    private int riskScore;
    private String riskLevel;
    private String explanation;
    private boolean flagged;
    private List<String> recommendations;
}
