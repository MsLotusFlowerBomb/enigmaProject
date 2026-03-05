package com.propmate.repository;

import com.propmate.model.Invoice;
import com.propmate.model.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByLease(Lease lease);
    List<Invoice> findByStatus(Invoice.Status status);
}
