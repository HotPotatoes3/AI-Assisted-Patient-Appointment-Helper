package com.example.demo.controller;

import com.example.demo.model.Doctor;
import com.example.demo.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors") // Base PATH for all doctor related APIs
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // API #1
    // This API returns a list of doctors from the database
    @GetMapping("/all")
    public List<Doctor> getDoctors() {
        return doctorService.getAllDoctors();
        


    }

    // API #2
    // This API returns a list of doctors based on the specialty provided as a path
    // variable
    @GetMapping("/specialty/{specialty}")
    public List<Doctor> listDoctorsBySpecialty(@PathVariable String specialty) {
        return doctorService.findBySpecialty(specialty);
    }

    // API #3
    // This API allows us to create a new doctor by sending a POST request with the
    // doctor's
    @PostMapping
    public void createDoctor(@RequestBody Doctor doctor) {
        doctorService.saveDoctor(doctor);
    }


    //API #4
    // This API gets a doctor by their ID, which is provided as a path variable in the URL. It returns the doctor object if found, or null if not found.
    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @DeleteMapping("/delete")
    void deleteDoctors() {
        // this would delete
        
    }
}
