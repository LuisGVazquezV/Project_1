package com.revature.services;

import com.revature.DAOs.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserDAO uDAO;

    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("Employee"); // Set default role if not provided
        }
        return uDAO.save(user);
    }

    public List<User> getAllUsers() {
        return uDAO.findAll();
    }


    public User getUserById(int userId) {
        return uDAO.findById(userId).orElse(null);
    }

    public void deleteUserById(int userId) {
        uDAO.deleteById(userId);
    }

    public User updateUserRole(int userId, String newRole) {
        Optional<User> existingUser = this.uDAO.findById(userId);
        if (existingUser.isPresent()) {
            User u = (User)existingUser.get();
            u.setRole(newRole);
            return (User)this.uDAO.save(u);
        } else {
            return null;
        }
    }

    public User updateUserById(int userId, User userUpdates) {
        Optional<User> existingUserOpt = this.uDAO.findById(userId);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Update only the fields provided
            if (userUpdates.getFirstName() != null && !userUpdates.getFirstName().isEmpty()) {
                existingUser.setFirstName(userUpdates.getFirstName());
            }
            if (userUpdates.getLastName() != null && !userUpdates.getLastName().isEmpty()) {
                existingUser.setLastName(userUpdates.getLastName());
            }
            if (userUpdates.getUsername() != null && !userUpdates.getUsername().isEmpty()) {
                existingUser.setUsername(userUpdates.getUsername());
            }
            if (userUpdates.getPassword() != null && !userUpdates.getPassword().isEmpty()) {
                existingUser.setPassword(userUpdates.getPassword());
            }

            return this.uDAO.save(existingUser);
        } else {
            return null; // User not found
        }
    }
}


