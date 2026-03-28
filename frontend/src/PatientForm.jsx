import { useState } from 'react';

function PatientForm({ onPatientAdded, apiBase }) {
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Patient name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email format required';
    }
    
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = 'Valid phone number required';
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
      const response = await fetch(`${apiBase}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage('✓ Patient registered successfully!');
        setMessageType('success');
        setForm({ name: '', email: '', phoneNumber: '' });
        setErrors({});
        if (onPatientAdded) {
          onPatientAdded();
        }
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
    } catch (error) {
      setMessage(`✗ Failed to register patient: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h2>Register New Patient</h2>
      
      {message && (
        <div className={`form-message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <label htmlFor="name">
            Patient Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter patient's full name"
            disabled={isSubmitting}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter patient's email"
            disabled={isSubmitting}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">
            Phone Number <span className="required">*</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Enter patient's phone number"
            disabled={isSubmitting}
            className={errors.phoneNumber ? 'input-error' : ''}
          />
          {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </section>
  );
}

export default PatientForm;
