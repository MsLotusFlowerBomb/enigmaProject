package com.propmate.repository;

import com.propmate.model.MaintenanceTicket;
import com.propmate.model.Property;
import com.propmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceTicketRepository extends JpaRepository<MaintenanceTicket, Long> {
    List<MaintenanceTicket> findByProperty(Property property);
    List<MaintenanceTicket> findByTenant(User tenant);
    List<MaintenanceTicket> findByStatus(MaintenanceTicket.Status status);
}
