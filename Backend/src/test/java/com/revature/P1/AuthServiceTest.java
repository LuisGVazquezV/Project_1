package com.revature.P1;

import com.revature.DAOs.AuthDAO;
import com.revature.models.DTOs.LoginDTO;
import com.revature.models.DTOs.OutgoingUserDTO;
import com.revature.models.User;
import com.revature.services.AuthService;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private AuthDAO authDAO;

    @Mock
    private HttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_ShouldReturnUserDTOIfCredentialsMatch() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testUser");
        loginDTO.setPassword("password");

        User user = new User();
        user.setUserId(1);
        user.setUsername("testUser");
        user.setRole("Employee");

        when(authDAO.findByUsernameAndPassword("testUser", "password")).thenReturn(user);

        OutgoingUserDTO result = authService.login(loginDTO, session);

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
        verify(session, times(1)).setAttribute("userId", 1);
    }

    @Test
    void login_ShouldReturnNullIfCredentialsDoNotMatch() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testUser");
        loginDTO.setPassword("password");

        when(authDAO.findByUsernameAndPassword("testUser", "password")).thenReturn(null);

        OutgoingUserDTO result = authService.login(loginDTO, session);

        assertNull(result);
    }

    @Test
    void logout_ShouldInvalidateSession() {
        authService.logout(session);

        verify(session, times(1)).invalidate();
    }
}
