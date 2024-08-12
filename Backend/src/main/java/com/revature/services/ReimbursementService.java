package com.revature.services;

import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.models.DTOs.IncomingReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class ReimbursementService {

    private static final LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
    private static final Logger logger = loggerContext.getLogger(ReimbursementService.class);

    private final ReimbursementDAO rDAO;
    private final UserDAO uDAO;

    @Autowired
    public ReimbursementService(ReimbursementDAO rDAO, UserDAO uDAO) {
        this.rDAO = rDAO;
        this.uDAO = uDAO;
    }

    public Reimbursement addReimbursement(IncomingReimbursementDTO newReimbursement) {
        logger.info("Adding reimbursement with description: {} and amount: {}", newReimbursement.getDescription(), newReimbursement.getAmount());

        Reimbursement reimbursement = new Reimbursement(0, newReimbursement.getDescription(), newReimbursement.getAmount(), newReimbursement.getStatus(), null);
        Optional<User> u = this.uDAO.findById(newReimbursement.getUserId());
        if (u.isPresent()) {
            reimbursement.setUser(u.get());
            logger.info("User found. Saving reimbursement.");
            return this.rDAO.save(reimbursement);
        } else {
            logger.warn("User with ID {} not found. Cannot add reimbursement.", newReimbursement.getUserId());
            return null;
        }
    }

    public List<Reimbursement> getAllReimbursements() {
        logger.info("Fetching all reimbursements.");
        return this.rDAO.findAll();
    }

    public List<Reimbursement> getReimbursementsByUserId(int userId) {
        logger.info("Fetching reimbursements for user ID: {}", userId);
        return this.rDAO.findByUserUserId(userId);
    }

    public Reimbursement getReimbursementById(int reimbId) {
        logger.info("Fetching reimbursement with ID: {}", reimbId);
        return rDAO.findById(reimbId).orElse(null);
    }

    public List<Reimbursement> getReimbursementsByStatus(String status) {
        logger.info("Fetching reimbursements with status: {}", status);
        return this.rDAO.findByStatus(status);
    }

    public Reimbursement updateReimbursementStatus(int reimbId, String newStatus) {
        logger.info("Updating status of reimbursement with ID: {} to {}", reimbId, newStatus);
        Optional<Reimbursement> existingReimbursement = this.rDAO.findById(reimbId);
        if(existingReimbursement.isPresent()){
            Reimbursement r = existingReimbursement.get();
            r.setStatus(newStatus);
            return this.rDAO.save(r);
        } else {
            logger.warn("Reimbursement with ID {} not found. Cannot update status.", reimbId);
            return null;
        }
    }

    public List<Reimbursement> getReimbursementsByUserIdAndStatus(int userId, String status) {
        logger.info("Fetching reimbursements for user ID: {} with status: {}", userId, status);
        return rDAO.findByUserUserIdAndStatus(userId, status);
    }

    public Reimbursement updateReimbursementDescription(int reimbId, String newDescription) {
        logger.info("Updating description of reimbursement with ID: {} to '{}'", reimbId, newDescription);
        Optional<Reimbursement> existingReimbursement = this.rDAO.findById(reimbId);

        if (existingReimbursement.isPresent()) {
            Reimbursement r = existingReimbursement.get();

            if (!"PENDING".equalsIgnoreCase(r.getStatus())) {
                logger.warn("Cannot update description of reimbursement with ID {} because status is not PENDING.", reimbId);
                return null;
            }

            r.setDescription(newDescription);
            return this.rDAO.save(r);
        } else {
            logger.warn("Reimbursement with ID {} not found. Cannot update description.", reimbId);
            return null;
        }
    }

    public void deleteReimbursementById(int reimbId) {
        logger.info("Deleting reimbursement with ID: {}", reimbId);
        Reimbursement reimbursement = rDAO.findById(reimbId).orElse(null);
        if (reimbursement != null) {
            reimbursement.getUser().getReimbursements().remove(reimbursement);
            rDAO.deleteById(reimbId);
            logger.info("Reimbursement with ID {} deleted successfully.", reimbId);
        } else {
            logger.warn("Reimbursement with ID {} not found. Cannot delete.", reimbId);
        }
    }
}
