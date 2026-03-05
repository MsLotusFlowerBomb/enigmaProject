package com.propmate.controller;

import com.propmate.model.Invoice;
import com.propmate.repository.InvoiceRepository;
import com.propmate.repository.LeaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private LeaseRepository leaseRepository;

    @GetMapping("/")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Invoice> payInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus(Invoice.Status.PAID);
            invoice.setPaidDate(LocalDate.now());
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lease/{leaseId}")
    public ResponseEntity<List<Invoice>> getInvoicesByLease(@PathVariable Long leaseId) {
        return leaseRepository.findById(leaseId)
                .map(lease -> ResponseEntity.ok(invoiceRepository.findByLease(lease)))
                .orElse(ResponseEntity.notFound().build());
    }
}
