package com.revature.services;

import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.models.DTOs.IncomingReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

@Service
public class ReimbursementService {

    private ReimbursementDAO rDAO;
    private UserDAO uDAO;

    @Autowired
    public ReimbursementService(ReimbursementDAO rDAO, UserDAO uDAO) {
        this.rDAO = rDAO;
        this.uDAO = uDAO;
    }

    public Reimbursement addReimbursement(IncomingReimbursementDTO newReimbursement) {
        Reimbursement reimbursement = new Reimbursement(0, newReimbursement.getDescription(), newReimbursement.getAmount(), newReimbursement.getStatus(), null);
        Optional<User> u = this.uDAO.findById(newReimbursement.getUserId());
        if (u.isPresent()) {
            reimbursement.setUser(u.get());
            return this.rDAO.save(reimbursement);
        } else {
            return null;
        }
    }

    /*@GetMapping*/
    public List<Reimbursement> getAllReimbursements() {
        return this.rDAO.findAll();
    }

    public List<Reimbursement> getReimbursementsByUserId(int userId) {
        return this.rDAO.findByUserUserId(userId);
    }

    public Reimbursement getReimbursementById(int reimbId) {
        return rDAO.findById(reimbId).orElse(null);
    }

    public List<Reimbursement> getReimbursementsByStatus(String status) {
        return this.rDAO.findByStatus(status);
    }

    public Reimbursement updateReimbursementStatus(int reimbId, String newStatus) {
        Optional<Reimbursement> existingReimbursement = this.rDAO.findById(reimbId);
        if(existingReimbursement.isPresent()){
            Reimbursement r = (Reimbursement)existingReimbursement.get();
            r.setStatus(newStatus);
            return (Reimbursement)this.rDAO.save(r);
        }else{
            return null;
        }


    }

    // Service method to get reimbursements by userId and status
    public List<Reimbursement> getReimbursementsByUserIdAndStatus(int userId, String status) {
        return rDAO.findByUserUserIdAndStatus(userId, status);
    }


    public Reimbursement updateReimbursementDescription(int reimbId, String newDescription) {
        Optional<Reimbursement> existingReimbursement = this.rDAO.findById(reimbId);

        if (existingReimbursement.isPresent()) {
            Reimbursement r = existingReimbursement.get();

            // Ensure status is being checked correctly
            if (!"PENDING".equalsIgnoreCase(r.getStatus())) {
                return null; // Return null if it's not pending
            }

            r.setDescription(newDescription);
            return this.rDAO.save(r);
        } else {
            return null;
        }
    }

    public void deleteReimbursementById(int reimbId) {

        Reimbursement reimbursement = rDAO.findById(reimbId).get();
        reimbursement.getUser().getReimbursements().remove(reimbursement);
        rDAO.deleteById(reimbId);
    }

}
