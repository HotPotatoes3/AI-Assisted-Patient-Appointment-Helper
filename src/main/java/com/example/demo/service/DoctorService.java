package com.example.demo.service;

import com.example.demo.model.Doctor;
import com.example.demo.repository.DoctorRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        if (id == null) {
            return null;
        }
        return doctorRepository.findById(id).orElse(null);
    }

    public List<Doctor> findBySpecialty(String specialty) {
        if (specialty == null || specialty.trim().isEmpty()) return List.of();
        return doctorRepository.findBySpecialty(specialty.trim());
    }

    public Doctor saveDoctor(Doctor doctor) {
        if (doctor == null) {
            throw new IllegalArgumentException("Doctor cannot be null");
        }
        return doctorRepository.save(doctor);
    }
}