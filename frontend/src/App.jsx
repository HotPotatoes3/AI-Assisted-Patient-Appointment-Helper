import { useEffect, useState } from 'react';
import DoctorForm from './DoctorForm';
import PatientForm from './PatientForm';
import AIAssistant from './AIAssistant';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function App() {
  const [currentPage, setCurrentPage] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
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

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE}/patients/all`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      setMessage(`Unable to fetch patients: ${error.message}`);
    }
  };

  useEffect(() => {
    if (currentPage === 'doctors') {
      fetchDoctors();
    } else {
      fetchPatients();
    }
  }, [currentPage]);

  const handleDoctorAdded = () => {
    fetchDoctors(specialtyFilter);
  };

  const handlePatientAdded = () => {
    fetchPatients();
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

      <nav className="navigation">
        <button
          className={`nav-button ${currentPage === 'doctors' ? 'active' : ''}`}
          onClick={() => setCurrentPage('doctors')}
        >
          Doctors
        </button>
        <button
          className={`nav-button ${currentPage === 'patients' ? 'active' : ''}`}
          onClick={() => setCurrentPage('patients')}
        >
          Patients
        </button>
      </nav>

      {currentPage === 'doctors' ? (
        <>
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
        </>
      ) : (
        <>
          <PatientForm onPatientAdded={handlePatientAdded} apiBase={API_BASE} />

          <section className="panel">
            <h2>Patient List</h2>

            {message && <p className="message">{message}</p>}

            <ul className="patient-list">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <li key={patient.id} className="patient-item">
                    <strong>{patient.name}</strong>
                    <span>{patient.email}</span>
                    <span>{patient.phoneNumber}</span>
                  </li>
                ))
              ) : (
                <li>No patients found.</li>
              )}
            </ul>
          </section>
        </>
      )}
      
      <AIAssistant />
    </div>
  );
}

export default App;
