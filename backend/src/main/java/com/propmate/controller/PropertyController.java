package com.propmate.controller;

import com.propmate.dto.CreatePropertyRequest;
import com.propmate.dto.FraudAnalysisResponse;
import com.propmate.dto.PropertyDTO;
import com.propmate.model.Property;
import com.propmate.repository.PropertyRepository;
import com.propmate.repository.UserRepository;
import com.propmate.service.FraudAnalysisResult;
import com.propmate.service.HuaweiCloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HuaweiCloudService huaweiCloudService;

    private PropertyDTO toDTO(Property p) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setAddress(p.getAddress());
        dto.setCity(p.getCity());
        dto.setProvince(p.getProvince());
        dto.setBedrooms(p.getBedrooms());
        dto.setBathrooms(p.getBathrooms());
        dto.setPrice(p.getPrice());
        dto.setPropertyType(p.getPropertyType());
        dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl());
        dto.setAvailable(p.isAvailable());
        dto.setCreatedAt(p.getCreatedAt());
        if (p.getLandlord() != null) {
            dto.setLandlordName(p.getLandlord().getName());
            dto.setLandlordId(p.getLandlord().getId());
        }
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAvailableProperties() {
        List<PropertyDTO> properties = propertyRepository.findByAvailableTrue()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        List<PropertyDTO> properties = propertyRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getProperty(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .map(p -> ResponseEntity.ok(toDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PropertyDTO> createProperty(@RequestBody CreatePropertyRequest request) {
        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setProvince(request.getProvince());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setPrice(request.getPrice());
        property.setPropertyType(request.getPropertyType());
        property.setDescription(request.getDescription());
        property.setImageUrl(request.getImageUrl());
        property.setAvailable(request.isAvailable());
        if (request.getLandlordId() != null) {
            userRepository.findById(request.getLandlordId()).ifPresent(property::setLandlord);
        }
        Property saved = propertyRepository.save(property);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PostMapping("/{id}/fraud-check")
    public ResponseEntity<FraudAnalysisResponse> fraudCheck(@PathVariable Long id) {
        Optional<Property> optProperty = propertyRepository.findById(id);
        if (optProperty.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Property property = optProperty.get();
        FraudAnalysisResult result = huaweiCloudService.analyzeListingForFraud(property);
        FraudAnalysisResponse response = new FraudAnalysisResponse(
                property.getId(),
                property.getTitle(),
                result.getRiskScore(),
                result.getRiskLevel(),
                result.getExplanation(),
                result.isFlagged(),
                result.getRecommendations()
        );
        return ResponseEntity.ok(response);
    }
}
