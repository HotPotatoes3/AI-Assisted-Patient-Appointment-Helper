import { useEffect, useState } from 'react';
import DoctorForm from './DoctorForm';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [message, setMessage] = useState('');

  const fetchDoctors = async (specialty) => {
    try {
      const path = specialty
        ? `${API_BASE}/doctors/specialty/${encodeURIComponent(specialty)}`
        : `${API_BASE}/doctors/all`;
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      setMessage(`Unable to fetch doctors: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorAdded = () => {
    fetchDoctors(specialtyFilter);
  };

  const filterBySpecialty = (event) => {
    event.preventDefault();
    fetchDoctors(specialtyFilter.trim());
  };

  const clearFilter = () => {
    setSpecialtyFilter('');
    fetchDoctors();
  };

  return (
    <div className="app-container">
      <h1>AI-Assisted Patient Appointment Helper</h1>

      <DoctorForm onDoctorAdded={handleDoctorAdded} apiBase={API_BASE} />

      <section className="panel">
        <h2>Doctor List</h2>
        <div className="filter-row">
          <input
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            placeholder="Filter by specialty"
          />
          <button onClick={filterBySpecialty}>Apply Filter</button>
          <button onClick={clearFilter}>Clear</button>
        </div>

        {message && <p className="message">{message}</p>}

        <ul className="doctor-list">
          {doctors.length > 0 ? (
            doctors.map((doc) => (
              <li key={doc.id} className="doctor-item">
                <strong>{doc.name}</strong>
                <span>{doc.specialty}</span>
                <span>{doc.email || 'No email'}</span>
              </li>
            ))
          ) : (
            <li>No doctors found.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default App;
