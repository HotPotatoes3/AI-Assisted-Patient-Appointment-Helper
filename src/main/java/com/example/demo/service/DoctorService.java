package com.example.demo.service;

import com.example.demo.model.Doctor;
import com.example.demo.repository.DoctorRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    // initially return a hard coded list of doctors before connecting to the
    // database.
    // save into a global array list of doctors and return it when the API is called
    private final List<Doctor> doctors = Collections.synchronizedList(new ArrayList<>());

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // This API returns a list of doctors from the database
    public List<Doctor> getAllDoctors() {

        // Try hard hard coded list first before first connecting to the database
        // and then returning the list of doctors from the database
        if (doctors.isEmpty()) {
            addDoctorToList(1L, "Dr. Meghamsh Kanuparthy", "Surgeon");
            addDoctorToList(2L, "Dr. John Smith", "Internal Medicine");
            addDoctorToList(3L, "Dr. Sachdeva", "Pediatrics");
            addDoctorToList(4L, "Dr. Haritha", "Dentist");
            addDoctorToList(5L, "Dr. X", "Surgeon");
        }
        return new ArrayList<>(doctors); // return a copy to avoid external modification

        // return doctorRepository.findAll();
    }

    public List<Doctor> findBySpecialty(String specialty) {
        if (specialty == null) {
            return Collections.emptyList();
        }
        String needle = specialty.trim();
        if (needle.isEmpty()) {
            return Collections.emptyList();
        }

        List<Doctor> result = new ArrayList<>();
        List<Doctor> allDoctors = getAllDoctors(); // ensure list is populated from getAllDoctors()
        System.err.println(allDoctors.size() + " doctors in total, searching for specialty: '" + needle + "'");
        for (Doctor doctor : allDoctors) {
            if (doctor.getSpecialty() != null && doctor.getSpecialty().equalsIgnoreCase(needle)) {
                result.add(doctor);
            }
        }
        System.err.println("findBySpecialty: specialty='" + specialty + "', found " + result.size() + " doctors");
        return new ArrayList<>(result);

        // return doctorRepository.findBySpecialty(specialty);
    }

    public void saveDoctor(Doctor doctor) {
        synchronized (doctors) {
            boolean exists = (doctor.getId() != null)
                    ? doctors.stream().anyMatch(d -> doctor.getId().equals(d.getId()))
                    : doctors.stream().anyMatch(d -> d.getName().equalsIgnoreCase(doctor.getName()));
            if (!exists) {
                doctors.add(doctor);
            }
        }
        // doctorRepository.save(doctor);
    }

    // util method to add doctor to the list of doctors
    private void addDoctorToList(Long id, String name, String specialiy) {
        synchronized (doctors) {
            boolean exists = doctors.stream().anyMatch(d -> d.getId() != null && d.getId().equals(id));
            if (exists)
                return;
            Doctor doctor = new Doctor(id);
            doctor.setName(name);
            doctor.setSpecialty(specialiy);
            doctors.add(doctor);
        }
    }
}