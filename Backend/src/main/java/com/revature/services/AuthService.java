package com.revature.services;

import com.revature.DAOs.AuthDAO;
import com.revature.models.DTOs.LoginDTO;
import com.revature.models.DTOs.OutgoingUserDTO;
import com.revature.models.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

    private static final LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
    private static final Logger logger = loggerContext.getLogger(AuthService.class);

    // Autowire the DAO
    private AuthDAO aDAO;

    @Autowired
    public AuthService(AuthDAO aDAO) {
        this.aDAO = aDAO;
    }

    // This method will take in a LoginDTO and return the User with those credentials (if exists)
    public OutgoingUserDTO login(LoginDTO lDTO, HttpSession session) {

        logger.info("Attempting login for user: {}", lDTO.getUsername());

        User u = aDAO.findByUsernameAndPassword(lDTO.getUsername(), lDTO.getPassword());
        logger.info("User fetched {}", u);

        if (u == null) {
            logger.warn("Login failed for user: {}", lDTO.getUsername());
            return null;
            // TODO: an Exception would be better
        } else {
            // If the user is not null (username/password pair match a user)...
            logger.info("Login successful for user: {}", u.getUsername());

            // Create an outgoing UserDTO and send it to the Controller
            OutgoingUserDTO outUser = new OutgoingUserDTO(u.getUserId(), u.getUsername(), u.getRole(), u.getFirstName(), u.getLastName());

            // Initialize the HttpSession sent in from AuthController and give it values
            session.setAttribute("userId", u.getUserId());
            session.setAttribute("username", u.getUsername());
            session.setAttribute("role", u.getRole());
            session.setAttribute("firstName", u.getFirstName());
            session.setAttribute("lastName", u.getLastName());

            // Send the user data back to the Controller -> FrontEnd
            return outUser;
        }
    }

    public void logout(HttpSession session) {
        logger.info("User logging out");
        session.invalidate();
    }
}
