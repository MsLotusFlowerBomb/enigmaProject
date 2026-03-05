package com.propmate.repository;

import com.propmate.model.Property;
import com.propmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByAvailableTrue();
    List<Property> findByLandlord(User landlord);
}
