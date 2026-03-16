package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private LocalDateTime appointmentTime;

    @ManyToOne
    private Doctor doctor;

    public Appointment() {}

    public Appointment(String patientName, LocalDateTime appointmentTime, Doctor doctor) {
        this.patientName = patientName;
        this.appointmentTime = appointmentTime;
        this.doctor = doctor;
    }

    public Long getId() { return id; }

    public String getPatientName() { return patientName; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }

    public Doctor getDoctor() { return doctor; }

    public void setPatientName(String patientName) { this.patientName = patientName; }

    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
}