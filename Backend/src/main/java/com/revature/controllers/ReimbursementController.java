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

    @PostMapping
    public ResponseEntity<Object> addReimbursement(@RequestBody IncomingReimbursementDTO newReimbursement) {
        Reimbursement r = this.rs.addReimbursement(newReimbursement);
        return r == null ? ResponseEntity.status(400).body("Couldn't find user with ID: " + newReimbursement.getUserId()) : ResponseEntity.status(201).body(r);
}

    @GetMapping
    public ResponseEntity <List<Reimbursement>> getAllReimbursements() {
        return ResponseEntity.ok(this.rs.getAllReimbursements());
    }

    @GetMapping("/{userId}")
    public List<Reimbursement> getReimbursementsByUserId(@PathVariable int userId) {
        return this.rs.getReimbursementsByUserId(userId);
    }

    @GetMapping("/status/{status}")
    public List<Reimbursement> getReimbursementsByStatus(@PathVariable String status) {
        return this.rs.getReimbursementsByStatus(status);
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

}
