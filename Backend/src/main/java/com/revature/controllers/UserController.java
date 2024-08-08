package com.revature.controllers;

import com.revature.models.User;
import com.revature.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService us;

    @PostMapping
    public User registerUser(@RequestBody User user) {
        // Validate and ensure no null fields are set
        if (user.getFirstName() == null || user.getFirstName().isEmpty()) {
            throw new IllegalArgumentException("First name cannot be empty");
        }
        return us.registerUser(user);
    }


    @GetMapping
    public ResponseEntity <Object> getAllUsers( HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (role ==null || !role.equalsIgnoreCase("Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can view all users");
        }

        if (us.getAllUsers() == null) {
            return ResponseEntity.status(400).body("No users found");
        }

        return ResponseEntity.ok(us.getAllUsers());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Object> deleteUserById(@PathVariable int userId, HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (role ==null || !role.equalsIgnoreCase("Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can delete users");
        }

        if (us.getUserById(userId) == null) {
            return ResponseEntity.status(400).body("User not found with ID: " + userId);
        }
        this.us.deleteUserById(userId);
        return ResponseEntity.ok("User with ID: " + userId + " deleted successfully");
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<Object> updateUserRole(@PathVariable int userId, @RequestBody String role, HttpSession session) {
        String role2 = (String) session.getAttribute("role");
        if (role2 ==null || !role2.equalsIgnoreCase("Manager")) {
            return ResponseEntity.status(403).body("Unauthorized access: Only managers can update user roles");
        }

        if (us.getUserById(userId) == null) {
            return ResponseEntity.status(400).body("User not found with ID: " + userId);
        }

        User updatedUser = this.us.updateUserRole(userId, role);
        return updatedUser == null ? ResponseEntity.status(400).body("User not found with ID: " + userId) : ResponseEntity.ok(updatedUser);
    }
}
