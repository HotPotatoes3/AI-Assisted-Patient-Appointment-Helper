package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    private String patientName;

    private LocalDateTime appointmentTime;

    private String timeSlot;

    private String reason;

    @ManyToOne
    private Doctor doctor;

    public Appointment() {}

    public Appointment(Long patientId, String patientName, LocalDateTime appointmentTime, 
                      String timeSlot, String reason, Doctor doctor) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.appointmentTime = appointmentTime;
        this.timeSlot = timeSlot;
        this.reason = reason;
        this.doctor = doctor;
    }

    public Long getId() { return id; }

    public Long getPatientId() { return patientId; }

    public String getPatientName() { return patientName; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }

    public String getTimeSlot() { return timeSlot; }

    public String getReason() { return reason; }

    public Doctor getDoctor() { return doctor; }

    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public void setPatientName(String patientName) { this.patientName = patientName; }

    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public void setReason(String reason) { this.reason = reason; }

    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
}