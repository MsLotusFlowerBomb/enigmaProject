package com.propmate.dto;

import com.propmate.model.MaintenanceTicket;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMaintenanceTicketRequest {
    private Long propertyId;
    private Long tenantId;
    private String title;
    private String description;
    private MaintenanceTicket.Priority priority;
    private String category;
}
