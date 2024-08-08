package com.revature.controllers;

import com.revature.DAOs.UserDAO;
import com.revature.models.DTOs.IncomingReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.services.ReimbursementService;
import com.revature.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reimbursements")
@CrossOrigin
public class ReimbursementController {
    private ReimbursementService rs;
    private UserDAO uDAO;
    private UserService us;

    @Autowired
    public ReimbursementController(ReimbursementService rs, UserDAO uDAO, UserService us) {
        this.rs = rs;
        this.uDAO = uDAO;
        this.us = us;
    }

    // Check if the user is logged in and has a valid role
    private boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("userId") != null;
    }

    // Check if the user has the required role
    private boolean hasValidRole(HttpSession session, String... allowedRoles) {
        String role = (String) session.getAttribute("role");
        if (role == null) return false;
        for (String allowedRole : allowedRoles) {
            if (role.equalsIgnoreCase(allowedRole)) {
                return true;
            }
        }
        return false;
    }

    @PostMapping
    public ResponseEntity<Object> addReimbursement(@RequestBody IncomingReimbursementDTO newReimbursement, HttpSession session) {
        if (!isLoggedIn(session)) {
            return ResponseEntity.status(401).body("Unauthorized: You must be logged in to submit a reimbursement.");
        }

        Reimbursement r = this.rs.addReimbursement(newReimbursement);
        return r == null ? ResponseEntity.status(400).body("Couldn't find user with ID: " + newReimbursement.getUserId()) : ResponseEntity.status(201).body(r);
    }

    @GetMapping
    public ResponseEntity<Object> getAllReimbursements(HttpSession session) {
        if (!isLoggedIn(session) || !hasValidRole(session, "Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can view all reimbursements.");
        }

        return ResponseEntity.ok(this.rs.getAllReimbursements());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Object> getReimbursementsByUserId(@PathVariable int userId, HttpSession session) {
        if (!isLoggedIn(session) || !hasValidRole(session, "Employee", "Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access.");
        }

        return ResponseEntity.ok(this.rs.getReimbursementsByUserId(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getReimbursementsByStatus(@PathVariable String status, HttpSession session) {
        if (!isLoggedIn(session) || !hasValidRole(session, "Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can view reimbursements by status.");
        }

        return ResponseEntity.ok(this.rs.getReimbursementsByStatus(status));
    }

    @GetMapping("/{userId}/status/{status}")
    public ResponseEntity<Object> getReimbursementsByUserIdAndStatus(
            @PathVariable int userId,
            @PathVariable String status,
            HttpSession session) {

        if (!isLoggedIn(session) || !hasValidRole(session, "Employee", "Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access.");
        }

        if (!status.equalsIgnoreCase("PENDING")) {
            return ResponseEntity.status(400).body("Invalid status. Only 'PENDING' status is allowed.");
        }

        return ResponseEntity.ok(this.rs.getReimbursementsByUserIdAndStatus(userId, status));
    }



    @PatchMapping("/{reimbId}")
    public ResponseEntity<Object> updateReimbursementStatus(@RequestBody String status, @PathVariable int reimbId, HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (role ==null || !role.equalsIgnoreCase("Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can update reimbursement status");

        }
        Reimbursement updatedReimbursement = this.rs.updateReimbursementStatus(reimbId, status);
        return updatedReimbursement == null ? ResponseEntity.status(400).body("Reimbursement not found with ID: " + reimbId) : ResponseEntity.ok(updatedReimbursement);

    }

    @PatchMapping("/{reimbId}/description")
    public ResponseEntity<Object> updateReimbursementDescription(
            @RequestBody String description,
            @PathVariable int reimbId,
            HttpSession session) {

        if (!isLoggedIn(session) || !hasValidRole(session, "Employee", "Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access.");
        }

        Reimbursement updatedReimbursement = this.rs.updateReimbursementDescription(reimbId, description);

        if (updatedReimbursement == null) {
            return ResponseEntity.status(400).body("Reimbursement not found or not in PENDING status.");
        }

        return ResponseEntity.ok(updatedReimbursement);
    }

    @DeleteMapping("/{reimbId}")
    public ResponseEntity<Object> deleteReimbursementById(@PathVariable int reimbId, HttpSession session) {
        if (!isLoggedIn(session) || !hasValidRole(session, "Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can delete reimbursements.");
        }

        if (this.rs.getReimbursementById(reimbId).isEmpty()) {
            return ResponseEntity.status(400).body("Reimbursement not found with ID: " + reimbId);
        }
        this.rs.deleteReimbursementById(reimbId);

        return ResponseEntity.ok("Reimbursement with ID: " + reimbId + " deleted successfully");
    }

}
