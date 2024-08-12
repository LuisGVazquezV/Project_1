package com.revature.P1;

import com.revature.DAOs.UserDAO;
import com.revature.models.User;
import com.revature.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserDAO userDAO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_ShouldSetDefaultRoleIfNotProvided() {
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("password");

        when(userDAO.save(user)).thenReturn(user);

        User result = userService.registerUser(user);

        assertNotNull(result);
        assertEquals("Employee", result.getRole());
    }

    @Test
    void getUserById_ShouldReturnUser() {
        User user = new User();
        user.setUserId(1);
        user.setUsername("testUser");

        when(userDAO.findById(1)).thenReturn(Optional.of(user));

        User result = userService.getUserById(1);

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
    }

    @Test
    void updateUserRole_ShouldUpdateRole() {
        User user = new User();
        user.setUserId(1);
        user.setRole("Employee");

        when(userDAO.findById(1)).thenReturn(Optional.of(user));
        when(userDAO.save(user)).thenReturn(user);

        User updatedUser = userService.updateUserRole(1, "Manager");

        assertNotNull(updatedUser);
        assertEquals("Manager", updatedUser.getRole());
    }

    @Test
    void updateUserById_ShouldUpdateUserDetails() {
        User existingUser = new User();
        existingUser.setUserId(1);
        existingUser.setFirstName("John");

        User userUpdates = new User();
        userUpdates.setFirstName("Jane");

        when(userDAO.findById(1)).thenReturn(Optional.of(existingUser));
        when(userDAO.save(existingUser)).thenReturn(existingUser);

        User updatedUser = userService.updateUserById(1, userUpdates);

        assertNotNull(updatedUser);
        assertEquals("Jane", updatedUser.getFirstName());
    }

    @Test
    void deleteUserById_ShouldDeleteUser() {
        doNothing().when(userDAO).deleteById(1);

        userService.deleteUserById(1);

        verify(userDAO, times(1)).deleteById(1);
    }
}
