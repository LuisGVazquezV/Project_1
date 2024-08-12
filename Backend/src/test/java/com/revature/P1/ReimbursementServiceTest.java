package com.revature.P1;

import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.models.DTOs.IncomingReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.services.ReimbursementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReimbursementServiceTest {

    @InjectMocks
    private ReimbursementService reimbursementService;

    @Mock
    private ReimbursementDAO reimbursementDAO;

    @Mock
    private UserDAO userDAO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addReimbursement_ShouldSaveReimbursement() {
        // Arrange
        IncomingReimbursementDTO dto = new IncomingReimbursementDTO();
        dto.setDescription("Test reimbursement");
        dto.setAmount(100.0);
        dto.setStatus("PENDING");
        dto.setUserId(1);

        User user = new User();
        user.setUserId(1);

        Reimbursement reimbursement = new Reimbursement(0, dto.getDescription(), dto.getAmount(), dto.getStatus(), user);

        when(userDAO.findById(dto.getUserId())).thenReturn(Optional.of(user));
        when(reimbursementDAO.save(any(Reimbursement.class))).thenReturn(reimbursement);

        // Act
        Reimbursement result = reimbursementService.addReimbursement(dto);

        // Assert
        assertNotNull(result);
        assertEquals("Test reimbursement", result.getDescription());
        assertEquals(100.0, result.getAmount());
        assertEquals("PENDING", result.getStatus());
        assertEquals(1, result.getUser().getUserId());
    }


    @Test
    void updateReimbursementStatus_ShouldUpdateStatus() {
        Reimbursement reimbursement = new Reimbursement();
        reimbursement.setStatus("PENDING");

        when(reimbursementDAO.findById(1)).thenReturn(Optional.of(reimbursement));
        when(reimbursementDAO.save(reimbursement)).thenReturn(reimbursement);

        Reimbursement updatedReimbursement = reimbursementService.updateReimbursementStatus(1, "APPROVED");

        assertNotNull(updatedReimbursement);
        assertEquals("APPROVED", updatedReimbursement.getStatus());
    }

    @Test
    void updateReimbursementDescription_ShouldUpdateDescription() {
        Reimbursement reimbursement = new Reimbursement();
        reimbursement.setStatus("PENDING");

        when(reimbursementDAO.findById(1)).thenReturn(Optional.of(reimbursement));
        when(reimbursementDAO.save(reimbursement)).thenReturn(reimbursement);

        Reimbursement updatedReimbursement = reimbursementService.updateReimbursementDescription(1, "New description");

        assertNotNull(updatedReimbursement);
        assertEquals("New description", updatedReimbursement.getDescription());
    }

    @Test
    void deleteReimbursementById_ShouldDeleteReimbursement() {
        // Arrange
        Reimbursement reimbursement = new Reimbursement();
        User user = new User();
        List<Reimbursement> reimbursements = new ArrayList<>();
        reimbursements.add(reimbursement);
        user.setReimbursements(reimbursements);
        reimbursement.setUser(user);

        when(reimbursementDAO.findById(1)).thenReturn(Optional.of(reimbursement));
        doNothing().when(reimbursementDAO).deleteById(1);

        // Act
        reimbursementService.deleteReimbursementById(1);

        // Assert
        verify(reimbursementDAO, times(1)).deleteById(1);
        assertFalse(user.getReimbursements().contains(reimbursement), "Reimbursement should be removed from the user's list");
    }

}
