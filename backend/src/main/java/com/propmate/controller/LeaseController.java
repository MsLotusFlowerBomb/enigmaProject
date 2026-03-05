package com.propmate.controller;

import com.propmate.dto.CreateLeaseRequest;
import com.propmate.model.Lease;
import com.propmate.model.Property;
import com.propmate.model.User;
import com.propmate.repository.LeaseRepository;
import com.propmate.repository.PropertyRepository;
import com.propmate.repository.UserRepository;
import com.propmate.service.HuaweiCloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leases")
public class LeaseController {

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HuaweiCloudService huaweiCloudService;

    @GetMapping("/")
    public ResponseEntity<List<Lease>> getAllLeases() {
        return ResponseEntity.ok(leaseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lease> getLease(@PathVariable Long id) {
        return leaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<Lease> generateLease(@RequestBody CreateLeaseRequest request) {
        Optional<Property> optProperty = propertyRepository.findById(request.getPropertyId());
        Optional<User> optTenant = userRepository.findById(request.getTenantId());
        Optional<User> optLandlord = userRepository.findById(request.getLandlordId());

        if (optProperty.isEmpty() || optTenant.isEmpty() || optLandlord.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Property property = optProperty.get();
        User tenant = optTenant.get();
        User landlord = optLandlord.get();

        String leaseContent = huaweiCloudService.generateLeaseAgreement(tenant, property);

        Lease lease = new Lease();
        lease.setProperty(property);
        lease.setTenant(tenant);
        lease.setLandlord(landlord);
        lease.setStartDate(request.getStartDate());
        lease.setEndDate(request.getEndDate());
        lease.setMonthlyRent(request.getMonthlyRent() != null ? request.getMonthlyRent() : property.getPrice());
        lease.setDepositAmount(lease.getMonthlyRent().multiply(new BigDecimal("2")));
        lease.setStatus(Lease.Status.PENDING);
        lease.setLeaseContent(leaseContent);

        Lease saved = leaseRepository.save(lease);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Lease>> getLeasesByTenant(@PathVariable Long tenantId) {
        return userRepository.findById(tenantId)
                .map(tenant -> ResponseEntity.ok(leaseRepository.findByTenant(tenant)))
                .orElse(ResponseEntity.notFound().build());
    }
}
