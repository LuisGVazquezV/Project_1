package com.revature.models;

import jakarta.persistence.*;

@Entity
@Table(name = "reimbursements")
public class Reimbursement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reimbId;

    @Column(nullable = false)
    private String description;

    private double amount;

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'pending'")
    private String status = "pending"; // "PENDING", "APPROVED", or "DENIED"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId") // Specifies the foreign key column name
    private User user;

    public Reimbursement() {
    }

    public Reimbursement(int reimbId, String description, double amount, String status, User user) {
        this.reimbId = reimbId;
        this.description = description;
        this.amount = amount;
        this.status = status;
        this.user = user;
    }

    public Reimbursement(int reimbId, double amount, String description, String status, User user) {
    }


    public int getReimbId() {
        return reimbId;
    }

    public void setReimbId(int reimbId) {
        this.reimbId = reimbId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Reimbursement [amount=" + amount + ", description=" + description + ", reimbId=" + reimbId
                + ", status=" + status + ", user=" + user + "]";
    }

}
