package com.propmate.config;

import com.propmate.model.*;
import com.propmate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private MaintenanceTicketRepository maintenanceTicketRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        // Seed landlords
        User landlord1 = new User();
        landlord1.setName("John Smith");
        landlord1.setEmail("john.smith@propmate.co.za");
        landlord1.setPhone("+27 11 234 5678");
        landlord1.setRole(User.Role.LANDLORD);
        landlord1 = userRepository.save(landlord1);

        User landlord2 = new User();
        landlord2.setName("Sarah Johnson");
        landlord2.setEmail("sarah.johnson@propmate.co.za");
        landlord2.setPhone("+27 21 345 6789");
        landlord2.setRole(User.Role.LANDLORD);
        landlord2 = userRepository.save(landlord2);

        // Seed tenant
        User tenant = new User();
        tenant.setName("Michael Brown");
        tenant.setEmail("michael.brown@gmail.com");
        tenant.setPhone("+27 82 456 7890");
        tenant.setRole(User.Role.TENANT);
        tenant = userRepository.save(tenant);

        // Seed properties
        Property prop1 = new Property();
        prop1.setTitle("Modern 2-Bed Apartment");
        prop1.setAddress("45 Buitenkant Street");
        prop1.setCity("Cape Town");
        prop1.setProvince("Western Cape");
        prop1.setBedrooms(2);
        prop1.setBathrooms(1);
        prop1.setPrice(new BigDecimal("12500"));
        prop1.setPropertyType("Apartment");
        prop1.setDescription("Beautifully renovated 2-bedroom apartment in the heart of Cape Town. Close to all amenities, public transport, and the vibrant city center. Features modern finishes and a secure parking bay.");
        prop1.setImageUrl("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800");
        prop1.setLandlord(landlord1);
        prop1.setAvailable(true);
        prop1 = propertyRepository.save(prop1);

        Property prop2 = new Property();
        prop2.setTitle("Spacious Family Home");
        prop2.setAddress("12 Oakwood Avenue");
        prop2.setCity("Johannesburg");
        prop2.setProvince("Gauteng");
        prop2.setBedrooms(4);
        prop2.setBathrooms(2);
        prop2.setPrice(new BigDecimal("18000"));
        prop2.setPropertyType("House");
        prop2.setDescription("Large family home in a quiet, established suburb. Features a garden, double garage, and braai area. Close to top schools and shopping centers.");
        prop2.setImageUrl("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800");
        prop2.setLandlord(landlord1);
        prop2.setAvailable(true);
        propertyRepository.save(prop2);

        Property prop3 = new Property();
        prop3.setTitle("Luxury Penthouse");
        prop3.setAddress("1 Sandton Drive, Level 20");
        prop3.setCity("Sandton");
        prop3.setProvince("Gauteng");
        prop3.setBedrooms(3);
        prop3.setBathrooms(3);
        prop3.setPrice(new BigDecimal("35000"));
        prop3.setPropertyType("Penthouse");
        prop3.setDescription("Stunning penthouse with panoramic views of Sandton CBD. Features a private rooftop terrace, chef's kitchen, and concierge service. The ultimate in luxury urban living.");
        prop3.setImageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800");
        prop3.setLandlord(landlord2);
        prop3.setAvailable(true);
        propertyRepository.save(prop3);

        Property prop4 = new Property();
        prop4.setTitle("Cozy Studio");
        prop4.setAddress("88 Church Street");
        prop4.setCity("Pretoria");
        prop4.setProvince("Gauteng");
        prop4.setBedrooms(1);
        prop4.setBathrooms(1);
        prop4.setPrice(new BigDecimal("2500"));
        prop4.setPropertyType("Studio");
        prop4.setDescription("Affordable studio apartment in Pretoria Central. Suitable for a single professional. Basic amenities included. NOTE: This listing has been flagged for price verification.");
        prop4.setImageUrl("https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800");
        prop4.setLandlord(landlord2);
        prop4.setAvailable(true);
        propertyRepository.save(prop4);

        // Seed lease
        Lease lease = new Lease();
        lease.setProperty(prop1);
        lease.setTenant(tenant);
        lease.setLandlord(landlord1);
        lease.setStartDate(LocalDate.of(2024, 1, 1));
        lease.setEndDate(LocalDate.of(2024, 12, 31));
        lease.setMonthlyRent(new BigDecimal("12500"));
        lease.setDepositAmount(new BigDecimal("25000"));
        lease.setStatus(Lease.Status.ACTIVE);
        lease.setLeaseContent("Standard residential lease agreement for Modern 2-Bed Apartment, Cape Town. Governed by the Rental Housing Act 50 of 1999.");
        lease = leaseRepository.save(lease);

        // Seed invoices
        Invoice invoice1 = new Invoice();
        invoice1.setLease(lease);
        invoice1.setAmount(new BigDecimal("12500"));
        invoice1.setDueDate(LocalDate.of(2024, 1, 1));
        invoice1.setPaidDate(LocalDate.of(2024, 1, 1));
        invoice1.setStatus(Invoice.Status.PAID);
        invoice1.setDescription("Monthly rent - January 2024");
        invoice1.setInvoiceNumber("INV-2024-001");
        invoiceRepository.save(invoice1);

        Invoice invoice2 = new Invoice();
        invoice2.setLease(lease);
        invoice2.setAmount(new BigDecimal("12500"));
        invoice2.setDueDate(LocalDate.of(2024, 2, 1));
        invoice2.setStatus(Invoice.Status.PENDING);
        invoice2.setDescription("Monthly rent - February 2024");
        invoice2.setInvoiceNumber("INV-2024-002");
        invoiceRepository.save(invoice2);

        Invoice invoice3 = new Invoice();
        invoice3.setLease(lease);
        invoice3.setAmount(new BigDecimal("12500"));
        invoice3.setDueDate(LocalDate.of(2023, 12, 1));
        invoice3.setStatus(Invoice.Status.LATE);
        invoice3.setDescription("Monthly rent - December 2023");
        invoice3.setInvoiceNumber("INV-2023-012");
        invoiceRepository.save(invoice3);

        // Seed maintenance tickets
        MaintenanceTicket ticket1 = new MaintenanceTicket();
        ticket1.setProperty(prop1);
        ticket1.setTenant(tenant);
        ticket1.setTitle("Leaking kitchen tap");
        ticket1.setDescription("The kitchen tap has been dripping continuously for 3 days. Water is pooling under the sink cabinet and causing potential water damage.");
        ticket1.setPriority(MaintenanceTicket.Priority.HIGH);
        ticket1.setStatus(MaintenanceTicket.Status.OPEN);
        ticket1.setCategory("Plumbing");
        maintenanceTicketRepository.save(ticket1);

        MaintenanceTicket ticket2 = new MaintenanceTicket();
        ticket2.setProperty(prop1);
        ticket2.setTenant(tenant);
        ticket2.setTitle("Bedroom ceiling light not working");
        ticket2.setDescription("The main ceiling light in the master bedroom stopped working. Bulb has been replaced but still not functioning - may be an electrical issue.");
        ticket2.setPriority(MaintenanceTicket.Priority.MEDIUM);
        ticket2.setStatus(MaintenanceTicket.Status.IN_PROGRESS);
        ticket2.setCategory("Electrical");
        maintenanceTicketRepository.save(ticket2);
    }
}
