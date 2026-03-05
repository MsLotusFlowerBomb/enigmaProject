package com.propmate.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lease_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Lease lease;

    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String description;
    private String invoiceNumber;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, PAID, LATE, CANCELLED
    }
}
