package com.propmate.controller;

import com.propmate.dto.InspectionResponse;
import com.propmate.service.HuaweiCloudService;
import com.propmate.service.InspectionResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/inspections")
public class InspectionController {

    @Autowired
    private HuaweiCloudService huaweiCloudService;

    @PostMapping("/analyze")
    public ResponseEntity<InspectionResponse> analyzeInspection(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "inspection_image";
        InspectionResult result = huaweiCloudService.analyzeInspectionImages(fileName);
        InspectionResponse response = new InspectionResponse(
                fileName,
                result.getDetectedDamages(),
                result.getTotalRepairCost(),
                result.getDepositDeductionAmount(),
                result.getRecommendation(),
                "COMPLETED"
        );
        return ResponseEntity.ok(response);
    }
}
