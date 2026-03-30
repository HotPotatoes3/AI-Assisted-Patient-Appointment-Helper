import { useEffect, useState } from 'react';

function AppointmentForm({ onAppointmentAdded, apiBase, patients, doctors }) {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    timeSlot: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.patientId) {
      newErrors.patientId = 'Please select a patient';
    }
    if (!form.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }
    if (!form.timeSlot.trim()) {
      newErrors.timeSlot = 'Time slot is required';
    }
    if (!form.reason.trim()) {
      newErrors.reason = 'Reason for visit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setMessage('Please fix the errors below');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const selectedPatient = patients.find(p => p.id == form.patientId);
      const selectedDoctor = doctors.find(d => d.id == form.doctorId);

      const appointmentData = {
        patientId: parseInt(form.patientId),
        patientName: selectedPatient?.name,
        timeSlot: form.timeSlot,
        reason: form.reason,
        doctor: {
          id: parseInt(form.doctorId),
          name: selectedDoctor?.name,
          specialty: selectedDoctor?.specialty
        }
      };

      const response = await fetch(`${apiBase}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setMessage('✓ Appointment booked successfully!');
        setMessageType('success');
        setForm({
          patientId: '',
          doctorId: '',
          timeSlot: '',
          reason: ''
        });
        setErrors({});
        if (onAppointmentAdded) {
          onAppointmentAdded();
        }
      } else {
        const errorText = await response.text();
        setMessage(`Failed to book appointment: ${response.status}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel">
      <h2>Book an Appointment</h2>

      <div className="form-group">
        <label htmlFor="patientId">Patient</label>
        <select
          id="patientId"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          className={errors.patientId ? 'error' : ''}
        >
          <option value="">-- Select Patient --</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        {errors.patientId && <span className="error-message">{errors.patientId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="doctorId">Doctor</label>
        <select
          id="doctorId"
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          className={errors.doctorId ? 'error' : ''}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.specialty})
            </option>
          ))}
        </select>
        {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="timeSlot">Time Slot</label>
        <input
          id="timeSlot"
          type="text"
          name="timeSlot"
          value={form.timeSlot}
          onChange={handleChange}
          placeholder="e.g., 9:00 - 9:15"
          className={errors.timeSlot ? 'error' : ''}
        />
        {errors.timeSlot && <span className="error-message">{errors.timeSlot}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reason">Reason for Visit</label>
        <textarea
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Describe the reason for the appointment"
          rows="4"
          className={errors.reason ? 'error' : ''}
        />
        {errors.reason && <span className="error-message">{errors.reason}</span>}
      </div>

      {message && <p className={`message ${messageType}`}>{message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
}

export default AppointmentForm;
