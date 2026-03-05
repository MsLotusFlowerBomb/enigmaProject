package com.propmate.controller;

import com.propmate.dto.CreateMaintenanceTicketRequest;
import com.propmate.model.MaintenanceTicket;
import com.propmate.repository.MaintenanceTicketRepository;
import com.propmate.repository.PropertyRepository;
import com.propmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceTicketRepository maintenanceTicketRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<List<MaintenanceTicket>> getAllTickets() {
        return ResponseEntity.ok(maintenanceTicketRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceTicket> getTicket(@PathVariable Long id) {
        return maintenanceTicketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/")
    public ResponseEntity<MaintenanceTicket> createTicket(@RequestBody CreateMaintenanceTicketRequest request) {
        MaintenanceTicket ticket = new MaintenanceTicket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setCategory(request.getCategory());
        ticket.setStatus(MaintenanceTicket.Status.OPEN);

        if (request.getPropertyId() != null) {
            propertyRepository.findById(request.getPropertyId()).ifPresent(ticket::setProperty);
        }
        if (request.getTenantId() != null) {
            userRepository.findById(request.getTenantId()).ifPresent(ticket::setTenant);
        }

        MaintenanceTicket saved = maintenanceTicketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceTicket> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        MaintenanceTicket.Status newStatus;
        try {
            newStatus = MaintenanceTicket.Status.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return maintenanceTicketRepository.findById(id).map(ticket -> {
            ticket.setStatus(newStatus);
            if (newStatus == MaintenanceTicket.Status.RESOLVED || newStatus == MaintenanceTicket.Status.CLOSED) {
                ticket.setResolvedAt(java.time.LocalDateTime.now());
            }
            return ResponseEntity.ok(maintenanceTicketRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<MaintenanceTicket>> getTicketsByProperty(@PathVariable Long propertyId) {
        return propertyRepository.findById(propertyId)
                .map(property -> ResponseEntity.ok(maintenanceTicketRepository.findByProperty(property)))
                .orElse(ResponseEntity.notFound().build());
    }
}
