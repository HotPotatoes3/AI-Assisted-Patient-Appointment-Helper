package com.example.demo.service;

import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, Patient patient) {
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if (existingPatient.isPresent()) {
            Patient p = existingPatient.get();
            if (patient.getName() != null) {
                p.setName(patient.getName());
            }
            if (patient.getEmail() != null) {
                p.setEmail(patient.getEmail());
            }
            if (patient.getPhoneNumber() != null) {
                p.setPhoneNumber(patient.getPhoneNumber());
            }
            return patientRepository.save(p);
        }
        return null;
    }

    public boolean deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Patient getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }
}
