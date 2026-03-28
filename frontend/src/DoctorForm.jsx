import { useState } from 'react';

function DoctorForm({ onDoctorAdded, apiBase }) {
  const [form, setForm] = useState({ name: '', specialty: '', email: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Doctor name is required';
    }
    if (!form.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email format required';
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
      const response = await fetch(`${apiBase}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage('✓ Doctor added successfully!');
        setMessageType('success');
        setForm({ name: '', specialty: '', email: '' });
        setErrors({});
        if (onDoctorAdded) {
          onDoctorAdded();
        }
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
    } catch (error) {
      setMessage(`✗ Failed to add doctor: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h2>Add New Doctor</h2>
      
      {message && (
        <div className={`form-message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="form-group">
          <label htmlFor="name">
            Doctor Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter doctor's full name"
            disabled={isSubmitting}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="specialty">
            Specialty <span className="required">*</span>
          </label>
          <input
            id="specialty"
            type="text"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            placeholder="e.g., Cardiology, Dermatology, Neurology"
            disabled={isSubmitting}
            className={errors.specialty ? 'input-error' : ''}
          />
          {errors.specialty && <span className="error-text">{errors.specialty}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (Optional)</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="doctor@hospital.com"
            disabled={isSubmitting}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Doctor...' : 'Add Doctor'}
        </button>
      </form>
    </section>
  );
}

export default DoctorForm;
