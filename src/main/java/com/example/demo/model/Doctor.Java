package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialty;

    public Doctor() {}

    public Doctor(String name, String specialty) {
        this.name = name;
        this.specialty = specialty;
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getSpecialty() { return specialty; }

    public void setName(String name) { this.name = name; }

    public void setSpecialty(String specialty) { this.specialty = specialty; }
}