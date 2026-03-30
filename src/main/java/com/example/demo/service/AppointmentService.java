package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(id);
        if (existingAppointment.isPresent()) {
            Appointment a = existingAppointment.get();
            if (appointment.getPatientId() != null) {
                a.setPatientId(appointment.getPatientId());
            }
            if (appointment.getPatientName() != null) {
                a.setPatientName(appointment.getPatientName());
            }
            if (appointment.getAppointmentTime() != null) {
                a.setAppointmentTime(appointment.getAppointmentTime());
            }
            if (appointment.getTimeSlot() != null) {
                a.setTimeSlot(appointment.getTimeSlot());
            }
            if (appointment.getReason() != null) {
                a.setReason(appointment.getReason());
            }
            if (appointment.getDoctor() != null) {
                a.setDoctor(appointment.getDoctor());
            }
            return appointmentRepository.save(a);
        }
        return null;
    }

    public boolean deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
