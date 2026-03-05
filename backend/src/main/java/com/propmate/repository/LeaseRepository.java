package com.propmate.repository;

import com.propmate.model.Lease;
import com.propmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    List<Lease> findByTenant(User tenant);
    List<Lease> findByStatus(Lease.Status status);
}
