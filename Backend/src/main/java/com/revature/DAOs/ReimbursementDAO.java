package com.revature.DAOs;

import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReimbursementDAO extends JpaRepository<Reimbursement, Integer> {
    List<Reimbursement> findByUserUserId(int userId);
    List<Reimbursement> findByStatus(String status);
    // DAO method to find reimbursements by userId and status
    List<Reimbursement> findByUserUserIdAndStatus(int userId, String status);

}


