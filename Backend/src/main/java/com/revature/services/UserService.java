package com.revature.services;

import com.revature.DAOs.UserDAO;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
    private static final Logger logger = loggerContext.getLogger(UserService.class);

    @Autowired
    private UserDAO uDAO;

    public User registerUser(User user) {
        logger.info("Registering user with username: {}", user.getUsername());

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("Employee"); // Set default role if not provided
            logger.info("No role provided. Setting default role: Employee");
        }

        User savedUser = uDAO.save(user);
        logger.info("User registered successfully with ID: {}", savedUser.getUserId());
        return savedUser;
    }

    public List<User> getAllUsers() {
        logger.info("Fetching all users.");
        return uDAO.findAll();
    }

    public User getUserById(int userId) {
        logger.info("Fetching user with ID: {}", userId);
        return uDAO.findById(userId).orElse(null);
    }

    public void deleteUserById(int userId) {
        logger.info("Deleting user with ID: {}", userId);
        uDAO.deleteById(userId);
        logger.info("User with ID: {} deleted successfully.", userId);
    }

    public User updateUserRole(int userId, String newRole) {
        logger.info("Updating role of user with ID: {} to {}", userId, newRole);
        Optional<User> existingUser = this.uDAO.findById(userId);
        if (existingUser.isPresent()) {
            User u = existingUser.get();
            u.setRole(newRole);
            User updatedUser = this.uDAO.save(u);
            logger.info("User role updated successfully for ID: {}", userId);
            return updatedUser;
        } else {
            logger.warn("User with ID: {} not found. Cannot update role.", userId);
            return null;
        }
    }

    public User updateUserById(int userId, User userUpdates) {
        logger.info("Updating user with ID: {}", userId);
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

            User updatedUser = this.uDAO.save(existingUser);
            logger.info("User with ID: {} updated successfully.", userId);
            return updatedUser;
        } else {
            logger.warn("User with ID: {} not found. Cannot update user.", userId);
            return null; // User not found
        }
    }

}
